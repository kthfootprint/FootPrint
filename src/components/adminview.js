import React, { Component } from "react";
import { compose } from "recompose";
import { withFirebase } from "./Firebase";
import { withAuthorization } from "./Auth";

import Col from "react-bootstrap/Col";

import * as ROLES from "../constants/roles";

class AdminView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userRoutes: {}
    }
  }

  componentDidMount() {
    this.props.firebase.getSelectedRoutes().then(userRoutes => {
      this.setState({ userRoutes })
    })
  }

  render() {
    return (
      <div>
        <Col xs={{ span: 8, offset: 2 }}>
          <h1>Admin page to review user data</h1>

        {console.log(this.state.userRoutes)}
        </Col>
      </div>
    )
  }
}

const condition = authUser =>
  authUser &&
  ((authUser.roles && !!authUser.roles[ROLES.ADMIN]) ||
    (authUser.authUser &&
      authUser.authUser.roles &&
      !!authUser.authUser.roles[ROLES.ADMIN]));

export default compose(withFirebase, withAuthorization(condition))(AdminView)
