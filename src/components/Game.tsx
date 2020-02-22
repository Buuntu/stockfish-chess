import React, { FC, useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { ChessInstance, Square } from 'chess.js'
import { GameTypes } from '../types';

const ChessReq:any = require('chess.js');

const useStyles = makeStyles({
  board: {
    marginTop: '20px',
    boxShadow: '5px 5px 5px grey',
  },
  button: {
    marginTop: '20px',
    marginLeft: '10px',
    marginRight: '10px',
  }
});

enum Turn {
  W = 'W',
  B = 'B',
};

type Move = {
  sourceSquare: Square,
  targetSquare: Square,
};

const Game: FC = () => {
  const classes = useStyles();

  const [game] = useState<ChessInstance>(new ChessReq());
  const [turn, setTurn] = useState<Turn>(Turn.W);
  const [fen, setFen] = useState("start");
  const [gameType, setGameType] = useState<GameTypes | null>(null);

  useEffect(() => {
    if (game.game_over()) return;

    if (turn === Turn.B) {
      setTimeout(() => {
        const newFen = randomMove(game)
        if (!newFen) return; // no more legal moves
        setTurn(Turn.W);
        setFen(newFen);
      }, 500);
    }

  }, [turn, game]);

  const randomMove = (game: ChessInstance): string | null => {
    const moves = game.moves();
    const move = moves[Math.floor(Math.random() * moves.length)];
    if (game.move(move) !== null) {
      return game.fen();
    }
    return null;
  }

  const onDrop = ({ sourceSquare, targetSquare }: Move) => {
    if (turn !== Turn.W) return;

    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to queen
    })

    if (move === null) return;

    setTurn(Turn.B);

    setFen(game.fen());
  };

  return (
    <div>
      <div className={classes.board}>
        <Chessboard 
          position={fen}
          onDrop={onDrop}
          transitionDuration={500}
        />
      </div>
      {!gameType && (
      <div>
        <Button
          className={classes.button}
          variant="contained"
          onClick={(event) => setGameType(GameTypes.RANDOM_COMPUTER)}
        >
          Play a Computer
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          onClick={(event) => setGameType(GameTypes.HUMAN)}
        >
          Play a Person
        </Button>
      </div>
      )}
    </div>
  );
};

export default Game;