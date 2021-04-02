from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.concurrency import run_until_first_complete
import uvicorn
import os
import aioredis
import contextvars

from app.api.api_v1.routers.users import users_router
from app.api.api_v1.routers.auth import auth_router
from app.api.api_v1.routers.websocket import ws_router
from app.api.api_v1.routers.game import game_router
from app.core import config
from app.db.schemas import WebSocketResponse, MessageTypeEnum
from app.db.session import SessionLocal
from app.core.auth import get_current_active_user
from app.core.notifier import Notifier, get_notifier, notifier
from app.core.celery_app import celery_app
from app import tasks

origins = [
    "http://localhost",
    "http://localhost:3000",
]

cvar_redis = contextvars.ContextVar('redis', default=None)

app = FastAPI(
    title=config.PROJECT_NAME,
    docs_url="/api/docs",
    openapi_url="/api",
)

@app.on_event("startup")
async def handle_startup():
    await notifier.generator.asend(None)
    try:
        pool = await aioredis.create_pool(
            ('redis', '6379'), encoding='utf-8', maxsize=20)
        cvar_redis.set(pool)
    except ConnectionRefusedError as e:
        print('cannot connect to redis on: redis://redis:6379')
        return

@app.on_event("shutdown")
async def handle_shutdown():
    redis = cvar_redis.get()
    redis.close()
    await redis.wait_closed()



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    expose_headers=["Content-Range"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


# Routers
app.include_router(
    users_router,
    prefix="/api/v1",
    tags=["users"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(ws_router, prefix="/api/ws", tags=["ws"], dependencies=[Depends(get_notifier)])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(game_router, prefix="/api/v1", tags=["game"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)
