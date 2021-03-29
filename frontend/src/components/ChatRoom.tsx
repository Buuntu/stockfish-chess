import React, { FC, useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  Typography,
  TextField,
  Container,
  Grid,
  Button,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Colors } from '../types';
import ReconnectingWebSocket from 'reconnecting-websocket';

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
  },
  messages: {
    textAlign: 'left',
  },
  messageIcon: {
    marginRight: '5px',
  },
});

type ChatRoomProps = {
  gameId?: number | null;
  socket: ReconnectingWebSocket | null;
  color: Colors;
};

export const ChatRoom: FC<ChatRoomProps> = ({ gameId, socket, color }) => {
  const classes = useStyles();

  const [message, setMessage] = useState<string>('');
  const [sentMessages, setSentMessages] = useState<string[]>([]);

  const parseMessage = (data: { message: string }) => {
    setSentMessages([...sentMessages, data['message']]);
  };

  useEffect(() => {
    setSentMessages([]);
  }, [gameId]);

  if (socket) {
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if ('message' in data) {
        parseMessage(data);
      }
    };
  }

  const keyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      //send message here
      if (socket) {
        socket.send(JSON.stringify({ message: message, color: color }));
      }
      setMessage('');
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setMessage(event.currentTarget.value);
  };

  return (
    <Paper elevation={7} className={classes.chatRoom}>
      <Typography variant="h6">
        Chat Room {gameId ? `#${gameId}` : null}
      </Typography>
      <Container className={classes.output}>
        {sentMessages.map((message, idx) => {
          return (
            <Grid key={idx} container>
              <Grid item>
                <AccountCircleIcon
                  className={classes.messageIcon}
                ></AccountCircleIcon>
              </Grid>
              <Grid item>
                <Typography className={classes.messages}>{message}</Typography>
              </Grid>
            </Grid>
          );
        })}
      </Container>
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
          <Button className={classes.button} variant="contained">
            Send
          </Button>
        </Grid>
        <Grid item></Grid>
      </Grid>
    </Paper>
  );
};
