import React from "react";

import { withFirebase } from "../Firebase";

const SignOut = ({ firebase }) => (
  <button variant="danger" type="button" onClick={() => firebase.signOut()}>
    Sign Out
  </button>
);

export default withFirebase(SignOut);
