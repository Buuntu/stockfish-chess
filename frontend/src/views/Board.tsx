import { Grid } from '@material-ui/core';
import { Game, Navigation } from 'components';

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
