import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withFirebase } from "./Firebase";

import SignIn from "./SignIn";
import SignUp from "./SignUp";
import PasswordReset from "./PasswordReset";

import * as ROUTES from "../constants/routes";

import "../styles/login.scss";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newUser: false,
      loading: true
    };
  }

  createNewUser = (e, bool) => {
    e.preventDefault();
    this.setState({ newUser: bool });
  };

  forgotPassword = (e, bool) => {
    e.preventDefault();
    this.setState({ forgotPassword: bool });
  };

  componentDidMount() {
    this.setState({ loading: false })
  }

  render() {
    return (
      !this.state.loading && (
      <div className="LoginPage">
        {this.props.firebase.auth.currentUser && <Redirect to={`${ROUTES.FIRSTLOGIN}/${this.props.firebase.auth.currentUser.uid}`}/>}

        {!this.state.newUser ? (
          [
            !this.state.forgotPassword ? (
              <SignIn
                key="signin"
                createNewUser={this.createNewUser}
                forgotPassword={this.forgotPassword}
              />
            ) : (
              <PasswordReset key="reset" forgotPassword={this.forgotPassword} />
            )
          ]
        ) : (
          <SignUp key="signup" createNewUser={this.createNewUser} />
        )}
      </div>)
    );
  }
}

export default withFirebase(LoginPage);
