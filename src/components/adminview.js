import React, { Component } from "react";
import { compose } from "recompose";
import { withFirebase } from "./Firebase";
import { withAuthorization } from "./Auth";

import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import * as ROLES from "../constants/roles";

import '../styles/adminview.scss'

class AdminView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userRoutes: [],
      loading: true
    }
  }

  componentDidMount() {
    this.props.firebase.getSelectedRoutes().then(userRoutes => {
      this.setState({ userRoutes, loading: false })
    })
  }

  render() {
    return (
      <div className="adminView">
        <Col xs={{ span: 10, offset: 1 }}>
          <h1>Admin page to review user data</h1>

          {!this.state.loading && (this.state.userRoutes.length !== 0) &&
            this.state.userRoutes.map((userData, k) => (
              <Card key={k}>
                {console.log(userData)}
                <Card.Header>
                  <p>{userData.orig.split(',')[0]} - {userData.dest.split(',')[0]}</p>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Duration</th>
                        <th>Emission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.routeOptions.map((option, k) => (
                        <tr key={k}>
                          <td>{parseInt(userData.selectedIndex) === k ? 'Selected' : k}</td>
                          <td>{option.departure}</td>
                          <td>{option.arrival}</td>
                          <td>{option.duration}</td>
                          <td>{userData.routeEmissions[k]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
                <Card.Footer>
                  <p>{new Date(userData.savedAt.seconds * 1000).toLocaleString('en-GB', { timeZone: 'UTC' })}</p>
                  <p className="author">Author: {userData.author}</p>
                </Card.Footer>
              </Card>
            )
            )
          }
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
