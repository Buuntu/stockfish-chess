import { Square } from 'chess.js';

export enum WhitePieces {
  K = '&#9812;',
  Q = '&#9813;',
  R = '&#9814;',
  N = '&#9816;',
  B = '&#9815;',
  P = '&#9817;',
}

export enum BlackPieces {
  K = '&#9818;',
  Q = '&#9819;',
  R = '&#9820;',
  B = '&#9821;',
  N = '&#9822;',
  P = '&#9823;',
}

export enum Colors {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export enum GameTypes {
  STOCKFISH_ENGINE = 'STOCKFISH_ENGINE',
  HUMAN = 'HUMAN',
}

export enum Turn {
  W = 'W',
  B = 'B',
}

export type Move = {
  sourceSquare: Square;
  targetSquare: Square;
};
