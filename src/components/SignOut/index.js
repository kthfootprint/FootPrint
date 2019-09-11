import React from "react";

import { withFirebase } from "../Firebase";

import Button from 'react-bootstrap/Button';

const SignOut = ({ firebase }) => (
  <Button variant="danger" type="button" onClick={() => firebase.signOut()}>
    Logga ut
  </Button>
);

export default withFirebase(SignOut);
