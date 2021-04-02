from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from broadcaster import Broadcast
from starlette.concurrency import run_until_first_complete
import uvicorn
import os

from app.api.api_v1.routers.users import users_router
from app.api.api_v1.routers.auth import auth_router
from app.api.api_v1.routers.websocket import ws_router
from app.api.api_v1.routers.game import game_router
from app.core import config
from app.db.schemas import WebSocketResponse, MessageTypeEnum
from app.db.session import SessionLocal
from app.core.auth import get_current_active_user
from app.core.celery_app import celery_app
from app import tasks

origins = [
    "http://localhost",
    "http://localhost:3000",
]

broadcast = Broadcast(os.getenv("REDIS_URL"))


async def chatroom_ws_receiver(websocket: WebSocket, game_id: int):
    async for message in websocket.iter_text():
        await broadcast.publish(channel=f"game-{game_id}", message=message)


async def chatroom_ws_sender(websocket: WebSocket, game_id: int):
    async with broadcast.subscribe(channel="game-{game_id}") as subscriber:
        async for event in subscriber:
            await websocket.send_text(event.message)


async def lobby_ws_receiver(websocket: WebSocket):
    async for message in websocket.iter_text():
        await broadcast.publish(channel="lobby", message=message)


async def lobby_ws_sender(websocket: WebSocket):
    async with broadcast.subscribe(channel="lobby") as subscriber:
        async for event in subscriber:
            await websocket.send_text(event.message)


app = FastAPI(
    title=config.PROJECT_NAME,
    docs_url="/api/docs",
    openapi_url="/api",
    on_startup=[broadcast.connect],
    on_shutdown=[broadcast.disconnect],
)


@app.websocket("/api/ws/game/{game_id}")
async def chatroom_ws(websocket: WebSocket, game_id: int):
    await websocket.accept()
    await run_until_first_complete(
        (chatroom_ws_receiver, {"websocket": websocket, "game_id": game_id}),
        (chatroom_ws_sender, {"websocket": websocket, "game_id": game_id}),
    )


@app.websocket("/api/ws/lobby")
async def chatroom_ws(websocket: WebSocket):
    await websocket.accept()
    await run_until_first_complete(
        (lobby_ws_receiver, {"websocket": websocket}),
        (lobby_ws_sender, {"websocket": websocket}),
    )


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
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(game_router, prefix="/api/v1", tags=["game"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)
