import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const INITIAL_STATE = {
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = e => {
    e.preventDefault();

    if (this.state.passwordOne !== this.state.passwordTwo)
      this.setState({
        error: {
          code: "auth/weak-password",
          message: "Passwords does not match"
        }
      });
    else {
      this.props.firebase
        .createUserWithEmailAndPassword(
          this.state.email,
          this.state.passwordOne
        )
        .then(() => {
          this.setState({ ...INITIAL_STATE });
        })
        .catch(error => {
          this.setState({ error });
        });
    }
  };

  onChange = e => {
    if (e.target.type === "checkbox")
      this.setState({ [e.target.name]: !this.state[e.target.name] });
    else this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const isInvalid =
      this.state.email === "" ||
      this.state.username === "" ||
      this.state.passwordOne === "" ||
      this.state.passwordTwo === "";

    return (
      <div className="signUpPage">
        <h3>Skapa nytt konto</h3>
        <form onSubmit={this.onSubmit} autoComplete="off">
          <Form.Control
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            placeholder="Mailadress"
          />

          <Form.Control
            name="passwordOne"
            value={this.state.passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Lösenord"
          />

          <Form.Control
            name="passwordTwo"
            value={this.state.passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Bekräfta lösenord"
          />

          <Button disabled={isInvalid} type="submit" block>
            Skapa konto
          </Button>

          {this.state.error && (
            <p className="error">{this.state.error.message}</p>
          )}
        </form>

        <a href="/login" onClick={e => this.props.createNewUser(e, false)}>
          Tillbaka
        </a>
      </div>
    );
  }
}

export default withFirebase(SignUp);
