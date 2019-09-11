import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';


const INITIAL_STATE = {
  email: "",
  password: "",
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
        this.setState({ error });
      });

    event.preventDefault();
  };

  facebookSubmit = e => {
    this.props.firebase
      .signInWithFacebook()
      .then(socialAuthUser => {
        this.setState({ error: null });
      })
      .catch(error => {
        this.setState({ error });
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
          <Button type="submit" block>Logga in</Button>

          <Button onClick={(e) => this.facebookSubmit(e)} style={{ backgroundColor: '#3b5998' }} block>
            <FontAwesomeIcon size="1x" icon={faFacebookF} />&emsp;Logga in med Facebook
                </Button>

          {this.state.error && (
            <p className="error">{this.state.error.message}</p>
          )}

          <hr />

          <Button variant="secondary" onClick={e => this.props.createNewUser(e, true)} block>
            Skapa ett konto
                </Button>

        </Form>

        <a
          href="/resetPassword"
          onClick={e => this.props.forgotPassword(e, true)}
        >
          Glömt lösenordet?
              </a>
      </div>
    );
  }
}

export default withFirebase(SignIn);
