from fastapi import APIRouter, WebSocket

ws_router = r = APIRouter()


@ws_router.websocket("/lobby")
async def websocket(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_json({"msg": "Hello WebSocket"})
    await websocket.close()


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
