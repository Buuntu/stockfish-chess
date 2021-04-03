from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
import aioredis
import asyncio
import logging

from app.core.auth import get_current_active_user
from app.db.schemas import WebSocketResponse

ws_router = r = APIRouter()

async def get_redis_pool():
    try:
        pool = await aioredis.create_redis_pool(
            ('redis', '6379'), encoding='utf-8')
        return pool
    except ConnectionRefusedError as e:
        print('cannot connect to redis')
        return None

@ws_router.websocket("/lobby")
async def lobby(websocket: WebSocket):
    await websocket.accept()

    await asyncio.gather(lobby_receive(websocket))


async def lobby_receive(
    websocket: WebSocket
):
    pool = await get_redis_pool()
    first_run = True
    latest_ids = ['$']

    while True and pool:
        if first_run:
            events = await pool.xrevrange('lobby')
            events.reverse()

            for e_id, e in events:
                await websocket.send_json(e)
                latest_ids = [e_id]
            first_run = False
        else:
            events = await pool.xread(
                ["lobby"],
                latest_ids=latest_ids
            )
            for _, e_id, e in events:
                await websocket.send_json(e)
                latest_ids = [e_id]


    pool.close()

async def game_receive(websocket: WebSocket, game_id: int):
    pool = await get_redis_pool()
    first_run = True
    ws_connected = True
    logger = logging.getLogger("api")

    while ws_connected:
        try:
            if first_run:
                stream_event_id = await pool.xadd('lobby', fields={ 'game_id': game_id })

                first_run = False
                return
        except WebSocketDisconnect:
            logger.debug('disconnected from game', game_id)
            print('disconnected from game', game_id)
            if stream_event_id:
                await pool.xdel(stream_event_id)
            await websocket.close()
            ws_connected = False

    pool.close()


@ws_router.websocket("/game/{game_id}")
async def websocket_game(
    game_id: int,
    websocket: WebSocket,
):
    await websocket.accept()

    await asyncio.gather(game_receive(websocket, game_id))

    

