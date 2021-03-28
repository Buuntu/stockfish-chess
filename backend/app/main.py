from fastapi import FastAPI, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from broadcaster import Broadcast
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

app = FastAPI(
    title=config.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api", 
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

class Notifier:
    """
    Class used to handle various websocket connections and broadcast
    messages to all of those

    WebSocket connections are tied to users and removed when a user
    disconnects
    """
    def __init__(self):
        self.connections: t.Dict[str, WebSocket] = {}
        self.generator = self.get_notification_generator()

    async def get_notification_generator(self):
        while True:
            message = yield
            await self._notify(message)

    async def push(self, msg: WebSocketResponse):
        await self.generator.asend(msg)

    async def connect(self, websocket: WebSocket, user_id: str):
        if user_id in self.connections:
            await self.push(WebSocketResponse(
                type=MessageTypeEnum.ERROR,
                data={
                    'message': 'user is already registered',
                    'user': user_id,
                }
            ))
        await websocket.accept()
        self.connections[user_id] = websocket

        await self.push(WebSocketResponse(
            type=MessageTypeEnum.USER_CONNECTED,
            data={
                'message': 'user connected',
                'user': user_id,
                'num_users': len(self.connections)
            }
        ))

    async def remove(self, websocket: WebSocket, user_id: str):
        if (user_id in self.connections):
            self.connections.pop(user_id)

            await self.push(WebSocketResponse(
                type=MessageTypeEnum.USER_DISCONNECTED,
                data={
                    'message': 'user disconnected',
                    'user': user_id,
                    'num_users': len(self.connections)
                }
            ))

    async def _notify(self, message: WebSocketResponse):
        living_connections = {}
        keys = list(self.connections)
        for user in keys:
            print(user)
            # Looping like this is necessary in case a disconnection is handled
            # during await websocket.send_text(message)
            websocket = self.connections.pop(user)
            await websocket.send_json(message.dict())
            living_connections[user] = websocket
        self.connections = living_connections


notifier = Notifier()


@app.websocket("/api/ws/lobby")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str = 'guest',
):
    await notifier.connect(websocket, user_id)
    try:
        while True:
            response = await websocket.receive_json()
            if 'type' in response and 'data' in response:
                await notifier.push(WebSocketResponse(
                    type=response['type'],
                    data=response['data'],
                ))
    except WebSocketDisconnect:
        await notifier.remove(websocket, user_id)


@app.on_event("startup")
async def startup():
    # Prime the push notification generator
    await notifier.generator.asend(None)


# Routers
# app.include_router(ws_router, prefix="/api/ws", tags=["ws"])
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
