from fastapi import WebSocket

from app.db.schemas import WebSocketResponse, MessageTypeEnum


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
            await self.push(
                WebSocketResponse(
                    type=MessageTypeEnum.ERROR,
                    data={
                        "message": "user is already registered",
                        "user": user_id,
                    },
                )
            )
        await websocket.accept()
        self.connections[user_id] = websocket

        await self.push(
            WebSocketResponse(
                type=MessageTypeEnum.USER_CONNECTED,
                data={
                    "message": "user connected",
                    "user": user_id,
                    "num_users": len(self.connections),
                },
            )
        )

    async def remove(self, websocket: WebSocket, user_id: str):
        if user_id in self.connections:
            self.connections.pop(user_id)

            await self.push(
                WebSocketResponse(
                    type=MessageTypeEnum.USER_DISCONNECTED,
                    data={
                        "message": "user disconnected",
                        "user": user_id,
                        "num_users": len(self.connections),
                    },
                )
            )

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

# Dependency
def get_notifier():
    try:
        yield notifier
    finally:
        print("Error with notifier")
