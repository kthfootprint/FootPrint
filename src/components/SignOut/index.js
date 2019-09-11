import React from "react";

import { withFirebase } from "../Firebase";

import Button from 'react-bootstrap/Button';

const SignOut = ({ firebase }) => (
  <Button variant="danger" type="button" onClick={() => firebase.signOut()}>
    Sign Out
  </Button>
);

export default withFirebase(SignOut);
