import 'App.scss';
import Game from 'components/Game';
import { Grid } from '@material-ui/core';
import Navigation from 'components/Navigation';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from 'Routes';

function App() {
  return (
    <Router>
      <Grid container>
        <Navigation></Navigation>
        <Routes />
        <Grid item xs={12}>
          <Game></Game>
        </Grid>
      </Grid>
    </Router>
  );
}

export default App;
