import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { Face, Fingerprint } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { login } from 'utils/auth';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  padding: {
    padding: theme.spacing(1),
  },
  button: {
    textTransform: 'none',
  },
  marginTop: {
    marginTop: 10,
  },
}));

export const LoginDialog = () => {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState(true);

  const handleSubmit = async (_: React.MouseEvent) => {
    setError('');
    try {
      const data = await login(email, password);

      if (data) {
        history.push('/');
      }
    } catch (err) {
      if (err instanceof Error) {
        // handle errors thrown from frontend
        setError(err.message);
      } else {
        // handle errors thrown from backend
        setError(err);
      }
    }
  };

  const handleClose = async () => {
    setOpen(false);
    history.push('/');
  };

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <div className={classes.margin}>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item>
              <Face />
            </Grid>
            <Grid item md={true} sm={true} xs={true}>
              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.currentTarget.value)
                }
                fullWidth
                autoFocus
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item>
              <Fingerprint />
            </Grid>
            <Grid item md={true} sm={true} xs={true}>
              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.currentTarget.value)
                }
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <br />
          <Grid container alignItems="center">
            {error && (
              <Grid item>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
          </Grid>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
              />
            </Grid>
            <Grid item>
              <Button
                disableFocusRipple
                disableRipple
                className={classes.button}
                variant="text"
                color="primary"
              >
                Forgot password ?
              </Button>
            </Grid>
          </Grid>
          <Grid container justify="center" className={classes.marginTop}>
            {' '}
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => history.push('/signup')}
            >
              Sign Up
            </Button>{' '}
            &nbsp;
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={handleSubmit}
            >
              Login
            </Button>
          </Grid>
        </div>
      </DialogContent>
    </Dialog>
  );
};
