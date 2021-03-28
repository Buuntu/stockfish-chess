import React from 'react';
import { Paper, makeStyles, Typography, Container } from '@material-ui/core';

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

export const GameLobby = () => {
  const classes = useStyles();
  const games: any = [];

  return (
    <Paper elevation={7} className={classes.gameLobby}>
      <Typography variant="h6">Game Lobby</Typography>
      <Container className={classes.output}>
        {games.length > 0 ? (
          games.map((game: any) => game)
        ) : (
          <Typography variant="body1">No active games availables</Typography>
        )}
      </Container>
    </Paper>
  );
};
