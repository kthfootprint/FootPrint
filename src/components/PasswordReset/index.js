import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordReset extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    e.preventDefault();

    this.props.firebase
      .resetPassword(this.state.email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.setState({ error: { code: 'succes', message: 'An email has been sent' } });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div>
        <h3>PasswordForget</h3>
        <form onSubmit={this.onSubmit}>
          <input name="email" value={this.state.email} onChange={this.onChange}
            type="text" placeholder="Email Address"/>

          <button variant="primary" disabled={this.state.email === ''} type="submit">
            Reset My Password
          </button>

          {this.state.error && <p className="error">{this.state.error.message}</p>}
        </form>

        <a href='/login' onClick={(e) => this.props.forgotPassword(e, false)}>Tillbaka</a>
      </div>
    );
  }
}

export default withFirebase(PasswordReset);