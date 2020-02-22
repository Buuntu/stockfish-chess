import React, { FC } from 'react';
import { AppBar, Toolbar, Button, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  appBar: {
    background: 'transparent',
    boxShadow: 'none',
    flex: 1,
  },
  buttons: {
    color: 'grey',
    fontSize: '20px',
  },
  title: {
    flex: 1,
    paddingLeft: '60px'
  },
});

const Navigation: FC = () => {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Typography variant="h4" className={classes.title}>Chess.io</Typography>
        <Button className={classes.buttons}>Login</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;