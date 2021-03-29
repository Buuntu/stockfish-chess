import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { ChessInstance } from 'chess.js';
import axios from 'axios';

import { GameTypes, Turn, Move } from 'types';
import { JoinGameDialog, GameLobby } from 'components';
import { BACKEND_URL } from '../utils/config';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { GameType } from './types';
import { useHistory, useParams } from 'react-router';

const ChessReq: any = require('chess.js');

const useStyles = makeStyles({
  board: {
    marginTop: '20px',
    boxShadow: '5px 5px 5px grey',
  },
  button: {
    marginTop: '20px',
    marginLeft: '10px',
    marginRight: '10px',
  },
});

type GamePropsType = {
  socket: ReconnectingWebSocket | null;
};

export const Game = ({ socket }: GamePropsType) => {
  const classes = useStyles();
  const history = useHistory();
  const { id: gameId } = useParams<{ id: string }>();

  const [game, setGame] = useState<ChessInstance>(new ChessReq());
  const [turn, setTurn] = useState<Turn>(Turn.W);
  const [fen, setFen] = useState('start');
  const [gameType, setGameType] = useState<GameTypes | null>(null);
  const [activeGames, setActiveGames] = useState<GameType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const getNextMove = async () => {
    const response = await axios.get(`${BACKEND_URL}/game`, {
      params: { board: game.fen() },
    });

    setFen(response.data);
    game.load(response.data);
    setTurn(Turn.W);
  };

  useEffect(() => {
    if (game.game_over()) return;

    if (gameType === GameTypes.STOCKFISH_ENGINE && turn === Turn.B) {
      // fetch next move from backend
      getNextMove();
    }
  }, [turn, game, gameType]);

  const onDrop = ({ sourceSquare, targetSquare }: Move) => {
    if (turn !== Turn.W) return;

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to queen
    });

    if (move === null) return;

    setTurn(Turn.B);

    setFen(game.fen());
  };

  const resetGame = () => {
    const newGame = new ChessReq();
    setFen(newGame.fen());
    setGame(newGame);
  };

  const newGameAgainstPerson = () => {
    setGameType(GameTypes.HUMAN);
    // reset board
    resetGame();

    // generate unique ID for game (should check that it doesn't already exist)
    const newGameId = Math.floor(Math.random() * 1000);

    if (socket) {
      socket.send(
        JSON.stringify({ type: 'NEW_GAME', data: { id: newGameId } })
      );
    }

    history.push(`/game/${newGameId}`);
  };

  if (socket) {
    socket.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
    };

    socket.onclose = () => {
      console.log('disconnected');
      // automatically try to reconnect on connection loss
    };

    socket.onmessage = function (e) {
      const server_message = JSON.parse(e.data);
      console.log(server_message);

      switch (server_message.type) {
        case 'NEW_GAME':
          setActiveGames([...activeGames, { id: server_message?.data?.id }]);
      }
      return false;
    };
  }

  return (
    <div>
      <div className={classes.board}>
        <Chessboard
          position={fen}
          onDrop={onDrop}
          transitionDuration={300}
          draggable={gameType !== null}
        />
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          onClick={() => setGameType(GameTypes.STOCKFISH_ENGINE)}
        >
          Play a Computer
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          onClick={newGameAgainstPerson}
        >
          New Game
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          onClick={() => setModalOpen(true)}
        >
          Join Game
        </Button>
        <JoinGameDialog open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  );
};
