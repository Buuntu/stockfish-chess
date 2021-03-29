import { Grid } from '@material-ui/core';
import { Game, Navigation } from 'components';

type LayoutType = {
  main: React.ReactElement;
  panel: React.ReactElement;
  actions?: React.ReactElement;
};

export const Layout = (props: LayoutType) => {
  const { main, panel } = props;

  return (
    <Grid container>
      <Navigation></Navigation>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item>{main}</Grid>
          <Grid item>{panel}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
