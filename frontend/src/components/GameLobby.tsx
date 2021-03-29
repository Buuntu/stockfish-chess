import { Paper, makeStyles, Typography, Container } from '@material-ui/core';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ActiveGame } from './ActiveGame';
import { GameType } from './types';

const useStyles = makeStyles({
  gameLobby: {
    height: '520px',
    width: '320px',
    marginLeft: '20px',
    marginTop: '20px',
    padding: '10px',
  },
  output: {
    border: '3px solid grey',
    borderRadius: '15px',
    padding: '10px',
    height: '90%',
  },
});

type GameLobbyType = {
  websocket: ReconnectingWebSocket | null;
  games: GameType[];
};

export const GameLobby = ({ websocket, games }: GameLobbyType) => {
  const classes = useStyles();

  return (
    <Paper elevation={7} className={classes.gameLobby}>
      <Typography variant="h6">Game Lobby</Typography>
      <Container className={classes.output}>
        {games.length > 0 ? (
          games.map((game) => <ActiveGame key={game.id} gameId={game.id} />)
        ) : (
          <Typography variant="body1">No active games availables</Typography>
        )}
      </Container>
    </Paper>
  );
};
