import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DotLoader from "react-spinners/DotLoader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

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
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ loading: false, error });
      });

    event.preventDefault();
  };

  facebookSubmit = e => {
    this.setState({ fbOAuthLoading: true })

    this.props.firebase
      .signInWithFacebook()
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ fbOAuthLoading: false, error });
      });

    e.preventDefault();
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="signInPage">
        <h3>Logga in</h3>
        {!this.state.loading && !this.state.fbOAuthLoading
          ?
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

          : <div className="loadingIndication">
            <DotLoader
              css={{ flex: 1, margin: '50px 0px', alignSelf: "center" }}
              loading={this.state.loading || this.state.fbOAuthLoading}
            />
            <p>{this.state.loading && 'Väntar på svar från FootPrints server'}</p>
            <p>{this.state.fbOAuthLoading && 'Väntar på svar från Facebook'}</p>
          </div>
        }

        {!this.state.loading && !this.state.fbOAuthLoading &&
          <a
            href="/resetPassword"
            onClick={e => this.props.forgotPassword(e, true)}
          >
            Glömt lösenordet?
        </a>
        }
      </div>
    );
  }
}

export default withFirebase(SignIn);
