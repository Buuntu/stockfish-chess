from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
from app.core.notifier import Notifier, get_notifier
from app.core.auth import get_current_active_user
from app.db.schemas import WebSocketResponse

ws_router = r = APIRouter()


@ws_router.websocket("/lobby")
async def websocket(
    websocket: WebSocket, notifier: Notifier = Depends(get_notifier)
):
    user_id = "guest"
    await notifier.connect(websocket, user_id)
    try:
        while True:
            response = await websocket.receive_json()
            if "type" in response and "data" in response:
                await notifier.push(
                    WebSocketResponse(
                        type=response["type"],
                        data=response["data"],
                    )
                )
    except WebSocketDisconnect:
        await notifier.remove(websocket, user_id)


@ws_router.websocket("/game/{game_id}")
async def websocket_game(
    game_id: int,
    websocket: WebSocket,
    notifier: Notifier = Depends(get_notifier),
):
    await notifier.connect(websocket, "guest")
    try:
        while True:
            response = await websocket.receive_json()
            if "type" in response and "data" in response:
                await notifier.push(
                    WebSocketResponse(
                        type=response["type"],
                        data=response["data"],
                    )
                )
    except WebSocketDisconnect:
        await notifier.remove(websocket, "guest")


"""
async def chatroom_ws(websocket: WebSocket):
    await websocket.accept()
    await run_until_first_complete(
        (chatroom_ws_receiver, {"websocket": websocket}),
        (chatroom_ws_sender, {"websocket": websocket}),
    )


async def chatroom_ws_receiver(websocket):
    async for message in websocket.iter_text():
        await broadcast.publish(channel="lobby", message=message)


async def chatroom_ws_sender(websocket):
    async with broadcast.subscribe(channel="lobby") as subscriber:
        async for event in subscriber:
            await websocket.send_text(event.message)
"""
