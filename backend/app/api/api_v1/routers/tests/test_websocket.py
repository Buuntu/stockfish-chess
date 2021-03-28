def test_websocket(client):
    with client.websocket_connect("/api/ws") as websocket:
        data = websocket.receive_json()
        assert data == {"msg": "Hello WebSocket"}