import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { withAuthentication } from './components/Auth';

import "./App.scss";
import SearchHeader from "./components/searchheader.js";
import LoginPage from "./components/loginpage.js";
//import GoogleApiWrapper from './components/routemap.js';

import * as ROUTES from './constants/routes';

const App = () => (
  <Router>

    <Switch>
      <Route exact path={ROUTES.LANDING} component={SearchHeader}/>
      <Route exact path={ROUTES.LOGIN} component={LoginPage}/>
      {/* <Route component={NoMatch} /> */}
    </Switch>
  </Router>
);

export default withAuthentication(App);
