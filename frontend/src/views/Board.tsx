import { Grid } from '@material-ui/core';
import Game from 'components/Game';
import Navigation from 'components/Navigation';
import React from 'react';

export const Board = () => {
  return (
    <Grid container>
      <Navigation></Navigation>
      <Grid item xs={12}>
        <Game></Game>
      </Grid>
    </Grid>
  );
};
