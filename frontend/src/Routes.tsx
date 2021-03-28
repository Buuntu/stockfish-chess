import { Admin } from 'admin';
import React from 'react';
import { Route, Switch } from 'react-router';
import { Login, Board } from 'views';
import { Register } from 'views/Register';

export const Routes = () => {
  return (
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/">
        <Route path="/register" component={Register}></Route>
        <Route path="/login" component={Login}></Route>
        <Board />
      </Route>
    </Switch>
  );
};
