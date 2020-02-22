import React from 'react';
import './App.scss';
import Game from './components/Game';
import { Grid } from '@material-ui/core';
import Navigation from './components/Navigation';

function App() {
  return (
    <Grid container>
      <Navigation></Navigation>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item>
            <Game></Game>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
