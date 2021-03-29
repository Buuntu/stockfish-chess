import { Admin } from 'admin';
import { Route, Switch } from 'react-router';

import { Login, Game, Main } from 'views';
import { Register } from 'views/Register';

export const Routes = () => {
  return (
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/game/:id">
        <Game />
      </Route>
      <Route path="/" exact>
        <Route path="/register" component={Register}></Route>
        <Route path="/login" component={Login}></Route>
        <Main />
      </Route>
    </Switch>
  );
};
