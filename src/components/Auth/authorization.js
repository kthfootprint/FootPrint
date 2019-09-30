import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.authUserListener(
        authUser => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.LOGIN);
          } else {
            this.setState({ authUser });
          }
        },
        () => this.props.history.push(ROUTES.LOGIN)
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      var renderElements = null;
      if (this.state.authUser && condition(this.state.authUser))
        renderElements = <Component {...this.props} />;

      return renderElements;
    }
  }

  return compose(
    withRouter,
    withFirebase
  )(WithAuthorization);
};

export default withAuthorization;
