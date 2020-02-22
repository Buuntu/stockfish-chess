import React, { FC, useState } from 'react';
import {
  Paper, makeStyles, Typography, TextField, Container, Grid, Button
} from '@material-ui/core';
import openSocket from 'socket.io-client';

const useStyles = makeStyles({
  chatRoom: {
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
    height: '80%',
  },
  input: {
    flex: 1,
    marginTop: '10px',
    height: '80%',
    width: '220px',
    padding: '2px',
  },
  button: {
    marginTop: '10px',
    marginLeft: '20px',
    height: '80%',
  },
  resize: {
    fontSize: '20px',
  }
});

const socket = openSocket('ws://localhost:8000/chat/test/');

export const ChatRoom: FC = () => {
  const classes = useStyles();

  const [message, setMessage] = useState<string>();

  const keyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      setMessage('');
      //send message here
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setMessage(event.currentTarget.value);
  }

  return (
    <Paper elevation={7} className={classes.chatRoom}>
      <Typography variant="h6">Chat Room</Typography>
      <Container className={classes.output}/>
      <Grid container>
        <Grid item>
        <TextField
          className={classes.input}
          variant="outlined"
          InputProps={{
            classes: {
              input: classes.resize,
            },
          }}
          onKeyPress={keyPress}
          value={message}
          onChange={onChange}
        ></TextField>
        <Button className={classes.button} variant="contained">Send</Button>
        </Grid>
        <Grid item>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ChatRoom;