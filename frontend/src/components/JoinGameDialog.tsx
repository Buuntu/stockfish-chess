import React, { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  dialog: {
    padding: '50px',
  },
  input: {
    marginBottom: '20px',
  },
  textInput: {
    fontSize: '30px',
  },
});

type DialogProps = {
  open: boolean;
  onClose: Function;
};

const JoinGameDialog: FC<DialogProps> = ({ open, onClose }) => {
  const classes = useStyles();
  const [gameId, setGameId] = useState<string>('');
  let history = useHistory();

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // check if gameId exists
    history.push(`/?game=${gameId}`);
    onClose();
  };

  return (
    <Dialog className={classes.dialog} open={open} onClose={() => onClose()}>
      <DialogTitle>Enter Game ID</DialogTitle>
      <DialogContent className={classes.dialog}>
        <div className={classes.input}>
          <TextField
            label="Game ID"
            type="contained"
            InputProps={{
              classes: {
                input: classes.textInput,
              },
            }}
            value={gameId}
            onChange={(event) => setGameId(event.currentTarget.value)}
          ></TextField>
        </div>
        <div>
          <Button variant="contained" onClick={onSubmit}>
            Join
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGameDialog;
