import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  game: {
    marginBottom: theme.spacing(1),
  },
}));

export const ActiveGame = ({ gameId }: { gameId: number }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box display="flex" justifyContent="space-between" className={classes.game}>
      <Typography variant="body1">Game {gameId}</Typography>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => history.push(`/game/${gameId}`)}
      >
        Join
      </Button>
    </Box>
  );
};
