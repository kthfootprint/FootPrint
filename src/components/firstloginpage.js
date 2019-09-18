import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { compose } from "recompose";
import { withAuthorization } from "./Auth";
import { withFirebase } from "./Firebase";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Media from "react-bootstrap/Media";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import footPrintPng from "../styles/foot.png";

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

    this.state = {
      ...INITIAL_STATE,
      profileId: this.props.match.params.id,
      requestUserData: true
    };
  }

  onChange = e => {
    if (e.target.type === "checkbox")
      this.setState({ [e.target.name]: e.target.checked });
    else this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    this.props.firebase
      .setMyUserData(this.state.age, this.state.gender, [ROLES.USER])
      .then(() => {
        this.setState({ ...INITIAL_STATE, requestUserData: false });
      })
      .catch(error => {
        this.setState({ error });
      });

    e.preventDefault();
  };

  componentDidMount() {
    this.props.firebase.getProfile(this.state.profileId).then(profile => {
      if (profile && !!profile.roles[ROLES.USER])
        this.setState({ requestUserData: false });
    });

    this.setState({ loading: false });
  }

  render() {
    const isInvalid =
      this.state.age === "" ||
      this.state.age < 10 ||
      this.state.age > 125 ||
      this.state.gender === "" ||
      this.state.termsOfService === false;

    return (
      <div className="FirstLoginPage">
        {!this.state.requestUserData ? (
          <Redirect to={ROUTES.LANDING} />
        ) : (
          <div className="RequestUserData">
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
                  <h3>Bara lite mer info...</h3>
                  <Form className="userDataForm" onSubmit={this.onSubmit}>
                    <Form.Control
                      name="age"
                      value={this.state.age}
                      onChange={this.onChange}
                      type="number"
                      placeholder="Ålder"
                      min="1"
                      max="125"
                    />

                    <Form.Control
                      as="select"
                      name="gender"
                      value={this.state.gender}
                      onChange={this.onChange}
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">
                        Other/Do not want to disclose
                      </option>
                    </Form.Control>

                    <Form.Check
                      name="termsOfService"
                      onChange={this.onChange}
                      type="checkbox"
                      label="Jag godkänner användarvillkoren."
                    />

                    <Button disabled={isInvalid} type="submit" block>
                      Börja använd FootPrint
                    </Button>

                    {this.state.error && (
                      <p className="error">{this.state.error.message}</p>
                    )}
                  </Form>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase
)(FirstLoginPage);
