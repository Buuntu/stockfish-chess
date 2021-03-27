from fastapi import APIRouter, Request, Depends, Response, encoders
import typing as t
import chess
import chess.engine
import asyncio

game_router = r = APIRouter()


@r.get(
    "/game",
)
async def game(board: str):
    """
    Calculate next move based on current board
    """
    b = chess.Board(board)
    engine = chess.engine.SimpleEngine.popen_uci("/usr/games/stockfish")
    result = engine.play(b, chess.engine.Limit(time=0.5))
    b.push(result.move)

    engine.quit()

    return b.fen()
