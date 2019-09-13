import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withFirebase } from "./Firebase";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Media from "react-bootstrap/Media";

import SignIn from "./SignIn";
import SignUp from "./SignUp";
import PasswordReset from "./PasswordReset";
import footPrintPng from "../styles/foot.png";

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
    this.setState({ loading: false });
  }

  render() {
    return (
      !this.state.loading && (
        <div className="LoginPage">
          {this.props.firebase.auth.currentUser && (
            <Redirect
              to={`${ROUTES.FIRSTLOGIN}/${this.props.firebase.auth.currentUser.uid}`}
            />
          )}

          <div className="LoginPageInner">
            <Container fluid>
              <Row className="justify-content-center">
                <Col xl={6} lg={8} md={10} xs={12}>
                  <Media>
                    <Image className="logotype" src={footPrintPng} />
                    <Media.Body className="align-self-center mr-3">
                      <h2>FootPrint</h2>
                    </Media.Body>
                  </Media>
                </Col>
              </Row>

              <Row className="content justify-content-center">
                <Col xl={6} lg={8} md={10} xs={12}>
                  {!this.state.newUser ? (
                    [
                      !this.state.forgotPassword ? (
                        <SignIn
                          key="signin"
                          createNewUser={this.createNewUser}
                          forgotPassword={this.forgotPassword}
                        />
                      ) : (
                        <PasswordReset
                          key="reset"
                          forgotPassword={this.forgotPassword}
                        />
                      )
                    ]
                  ) : (
                    <SignUp key="signup" createNewUser={this.createNewUser} />
                  )}
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      )
    );
  }
}

export default withFirebase(LoginPage);
