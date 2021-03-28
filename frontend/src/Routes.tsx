import { Admin } from 'admin';
import React from 'react';
import { Route, Switch } from 'react-router';
import { Login, Board } from 'views';

export const Routes = () => {
  return (
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/login" component={Login}></Route>
      <Route exact path="/" component={Board}></Route>
    </Switch>
  );
};
