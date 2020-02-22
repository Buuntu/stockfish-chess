import React from 'react';
import './App.scss';
import Game from './components/Game';
import { Grid, Paper } from '@material-ui/core';
import Navigation from './components/Navigation';
import ChatRoom from './components/ChatRoom';

function App() {
  return (
    <Grid container>
      <Navigation></Navigation>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item>
            <Game></Game>
          </Grid>
          <Grid item>
            <ChatRoom></ChatRoom>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
