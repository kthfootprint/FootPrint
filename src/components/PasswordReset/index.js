import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const INITIAL_STATE = {
  email: "",
  error: null
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
        this.setState({
          error: { code: "succes", message: "An email has been sent" }
        });
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
      <div className="passwordResetPage">
        <h3>Återställ lösenord</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Control
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />

          <Button
            variant="primary"
            disabled={this.state.email === ""}
            type="submit"
            block
          >
            Reset My Password
          </Button>

          {this.state.error && (
            <p className="error">{this.state.error.message}</p>
          )}
        </Form>

        <a href="/login" onClick={e => this.props.forgotPassword(e, false)}>
          Tillbaka
        </a>
      </div>
    );
  }
}

export default withFirebase(PasswordReset);
