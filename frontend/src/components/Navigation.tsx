import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';

import { useHistory } from 'react-router';

const useStyles = makeStyles({
  appBar: {
    background: 'transparent',
    boxShadow: 'none',
    flex: 1,
  },
  buttons: {
    color: 'grey',
    fontSize: '20px',
    marginRight: '10px',
  },
  title: {
    color: 'grey',
    flex: 1,
    paddingLeft: '60px',
  },
});

const Navigation = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Typography variant="h4" className={classes.title}>
          Stockfish Chess
        </Typography>
        <Button
          className={classes.buttons}
          onClick={() => history.push('/register')}
        >
          Register
        </Button>
        <Button
          className={classes.buttons}
          onClick={() => history.push('/login')}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
