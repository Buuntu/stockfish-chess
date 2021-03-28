import React from 'react';
import { Route, Switch } from 'react-router';
import { Login } from 'views';

export const Routes = () => {
  return (
    <Switch>
      <Route path="/login" component={Login}></Route>
    </Switch>
  );
};
