import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { withAuthentication } from "./components/Auth";

import "./App.scss";
import SearchView from "./components/searchview.js";
import LoginPage from "./components/loginpage.js";
import FirstLoginPage from "./components/firstloginpage.js";
import PrivacyView from "./components/privacyview";
//import GoogleApiWrapper from './components/routemap.js';

import * as ROUTES from "./constants/routes";

const App = () => (
  <Router>
    <Switch>
      <Route exact path={ROUTES.LANDING} component={SearchView} />
      <Route exact path={ROUTES.LOGIN} component={LoginPage} />
      <Route
        exact
        path={ROUTES.FIRSTLOGIN + "/:id"}
        component={FirstLoginPage}
      />
      <Route exact path={ROUTES.PRIVACY} component={PrivacyView} />
      {/* <Route component={NoMatch} /> */}
    </Switch>
  </Router>
);

export default withAuthentication(App);
