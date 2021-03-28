import React, { FC, useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { ChessInstance } from 'chess.js';
import axios from 'axios';

import { GameTypes, Turn, Colors, Move } from 'types';
import { JoinGameDialog, GameLobby } from 'components';
import { BACKEND_URL } from '../utils/config';

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

const Game: FC = () => {
  const classes = useStyles();

  const [game, setGame] = useState<ChessInstance>(new ChessReq());
  const [turn, setTurn] = useState<Turn>(Turn.W);
  const [fen, setFen] = useState('start');
  const [gameType, setGameType] = useState<GameTypes | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [gameId, setGameId] = useState<number>(1);
  const [socket, setSocket] = useState(
    new WebSocket('ws://localhost:8000/ws/chat/guest/')
  );

  const randomMove = (): string | null => {
    const moves = game.moves();
    const move = moves[Math.floor(Math.random() * moves.length)];
    if (game.move(move) !== null) {
      return game.fen();
    }
    return null;
  };

  const getNextMove = async () => {
    const response = await axios.get(`${BACKEND_URL}/game`, {
      params: { board: game.fen() },
    });

    setFen(response.data);
    game.load(response.data);
    setTurn(Turn.W);
  };

  useEffect(() => {
    // Changing to a new game
    //setSocket(new WebSocket(`ws://localhost:8000/ws/chat/${gameId}/`));
    // fetch game state from db
  }, [gameId]);

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
    setGameId(Math.floor(Math.random() * 1000));
  };

  return (
    <Grid container justify="center">
      <Grid item>
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
            <JoinGameDialog
              open={modalOpen}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      </Grid>
      <Grid item>
        <GameLobby />
      </Grid>
    </Grid>
  );
};

export default Game;
