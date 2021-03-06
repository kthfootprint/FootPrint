import React, { Component } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DotLoader from "react-spinners/DotLoader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import * as ROUTES from "../../constants/routes";

const INITIAL_STATE = {
  email: "",
  password: "",
  loading: false,
  fbOAuthLoading: false,
  error: null
};

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    this.setState({ loading: true });

    this.props.firebase
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        if (!user.additionalUserInfo.isNewUser) {
          this.props.history.push(ROUTES.LANDING);
        }
      })
      .catch(error => {
        this.setState({ loading: false, error });
      });

    event.preventDefault();
  };

  facebookSubmit = e => {
    this.setState({ fbOAuthLoading: true });

    localStorage.setItem("fbOathExpires", new Date().valueOf() + 20000);

    this.props.firebase
      .signInWithFacebook()
      .then(user => {
        if (!user.additionalUserInfo.isNewUser) {
          this.props.history.push(ROUTES.LANDING);
        }
      })
      .catch(error => {
        this.setState({ fbOAuthLoading: false, error });
      });

    e.preventDefault();
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    if (localStorage.getItem("fbOathExpires") >= new Date().valueOf()) {
      localStorage.removeItem("fbOathExpires");
      this.setState({ fbOAuthLoading: true });
    }
  }

  render() {
    return (
      <div className="signInPage">
        <h3>Logga in</h3>
        {!this.state.loading && !this.state.fbOAuthLoading ? (
          <Form onSubmit={this.onSubmit} autoComplete="off">
            <Form.Control
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              type="text"
              placeholder="Mailadress"
            />
            <br />
            <Form.Control
              name="password"
              value={this.state.passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Lösenord"
            />
            <br />
            <Button type="submit" block>
              Logga in
            </Button>

            <Button
              onClick={e => this.facebookSubmit(e)}
              style={{ backgroundColor: "#3b5998" }}
              block
            >
              <FontAwesomeIcon size="1x" icon={faFacebookF} />
              &emsp;Logga in med Facebook
            </Button>

            {this.state.error && (
              <p className="error">{this.state.error.message}</p>
            )}

            <hr />

            <Button
              variant="secondary"
              onClick={e => this.props.createNewUser(e, true)}
              block
            >
              Skapa ett konto
            </Button>
          </Form>
        ) : (
          <div className="loadingIndication">
            <DotLoader
              css={{ flex: 1, margin: "50px 0px", alignSelf: "center" }}
              loading={this.state.loading || this.state.fbOAuthLoading}
            />
            <p>
              {this.state.loading && "Väntar på svar från FootPrints server"}
            </p>
            <p>{this.state.fbOAuthLoading && "Väntar på svar från Facebook"}</p>
          </div>
        )}

        {!this.state.loading && !this.state.fbOAuthLoading && (
          <a
            href="/resetPassword"
            onClick={e => this.props.forgotPassword(e, true)}
          >
            Glömt lösenordet?
          </a>
        )}
      </div>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(SignIn);
