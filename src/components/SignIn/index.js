import React, { Component } from "react";

import { withFirebase } from "../Firebase";

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
      <div>
        <h3>Logga in</h3>
        <form onSubmit={this.onSubmit} autoComplete="off">
          <input
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            placeholder="Mailadress"
          />
          <br />
          <input
            name="password"
            value={this.state.passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Lösenord"
          />
          <br />
          <button type="submit">Logga in</button>

          {this.state.error && (
            <p className="error">{this.state.error.message}</p>
          )}

          <button onClick={e => this.props.createNewUser(e, true)}>
            Skapa ett konto
          </button>

          <button onClick={(e) => this.facebookSubmit(e)}>
            <FontAwesomeIcon size="1x" icon={faFacebookF}/>
            Logga in med Facebook
          </button>
        </form>

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
