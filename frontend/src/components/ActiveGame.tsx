import { Typography } from '@material-ui/core';

export const ActiveGame = ({ gameId }: { gameId: number }) => {
  return <Typography variant="body1">Game {gameId}</Typography>;
};
