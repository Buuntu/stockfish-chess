def test_game(client):
    payload = {
        "board": "r1bqkbnr/p1pp1ppp/1pn5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 4"
    }
    response = client.get("/api/v1/game", params=payload)

    assert response.status_code == 200
