import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { compose } from 'recompose';
import { withAuthorization } from './Auth';
import { withFirebase } from "./Firebase";

import * as ROUTES from "../constants/routes";
import * as ROLES from "../constants/roles";

import "../styles/login.scss";

const INITIAL_STATE = {
  age: "",
  gender: "",
  termsOfService: false,
  error: null,
  loading: true
};

class FirstLoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE, 
      profileId: this.props.match.params.id,
      requestUserData: true 
    };
  }

  onChange = e => {
    if (e.target.type === 'checkbox')
      this.setState({ [e.target.name]: e.target.checked })
    else
      this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    this.props.firebase.setMyUserData(this.state.age, this.state.gender, [ROLES.USER])
      .then(() => {
        this.setState({ ...INITIAL_STATE, requestUserData: false });
      })
      .catch(error => {
        this.setState({ error });
      });

    e.preventDefault();
  }

  componentDidMount() {
    this.props.firebase.getProfile(this.state.profileId)
      .then(profile => {
        if (profile && !!profile.roles[ROLES.USER])
          this.setState({ requestUserData: false })
      })
      
    this.setState({ loading: false })
  }

  render() {
    const isInvalid = 
      this.state.age === '' ||
      this.state.age < 10 ||
      this.state.age > 125 ||
      this.state.gender === '' ||
      this.state.termsOfService === false;

    return (
      <div className="FirstLoginPage">
        {!this.state.requestUserData
          ? <Redirect to={ROUTES.LANDING}/>
          : <div className="RequestUserData">
              <h1>Fyll i data här</h1>
              <form onSubmit={this.onSubmit}>
                <input name="age" value={this.state.age} onChange={this.onChange}
                  type="number" placeholder="Ålder" min="1" max="125"/>

                <select name="gender" value={this.state.gender} onChange={this.onChange}>
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other/Do not want to disclose</option>
                  </select>

                <input name="termsOfService" onChange={this.onChange}
                  type="checkbox" label="Jag godkänner användarvillkoren." />

                <button disabled={isInvalid} type="submit">Sign Up</button>

                {this.state.error && <p className="error">{this.state.error.message}</p>}
              </form>
            </div>
        }
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(withAuthorization(condition),withFirebase,)(FirstLoginPage);
