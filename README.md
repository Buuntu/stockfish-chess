# Chess.io

Making a simple chess game using React, Django, and Websockets.

Websockets lets the game feel more interactive and avoids
doing things like polling the server for updates over HTTP.

## Development

Requires redis to be running since Django Channels (Websockets) needs it to 
work properly.

### Redis
```
docker run -p 6379:6379 -d redis:2.8
```

Or however you want to start redis on port 6379

### Backend
```
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```
cd frontend

npm install
npm start
```
## TODO

1. Get docker-compose working. It's frustratingly hard to get this to work with 
hot reloading, hopefully the dev process would then just become:
```
docker-compose up -d
```

2. Add authentication. This is somewhat annoying to do with React since
you can't use Django's out of the box system

3. Add smart AI using minimax algorithm and/or 
[Stockfish](https://stockfishchess.org/) engine.