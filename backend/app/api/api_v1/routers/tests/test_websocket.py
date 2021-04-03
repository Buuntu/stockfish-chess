from fastapi.testclient import TestClient
from httpx import AsyncClient
import pytest

from app.main import app

"""
def test_game_lobby_connect(client):
    with client.websocket_connect('/api/ws/lobby') as websocket:
        pass

def test_game_id_connect(client):
    with client.websocket_connect('/api/ws/game/1') as ws:
        pass
"""
