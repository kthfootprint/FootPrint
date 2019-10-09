import React, { Component } from "react";
import { withFirebase } from "./Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

class logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  toggle = () => {
    this.setState({ show: !this.state.show });
  };
  render() {
    return (
      <div
        className={"logout " + (this.state.show ? "open" : "")}
        tabIndex="0"
        onBlur={() => this.setState({ show: false })}
      >
        <div className="optionIcon" onClick={this.toggle}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            rotation={this.state.show ? 180 : null}
            size="2x"
            color="white"
          />
        </div>
        <div
          className="signOut"
          hidden={!this.state.show}
          onClick={this.props.firebase.signOut}
        >
          <p>Sign out</p>
        </div>
      </div>
    );
  }
}

export default withFirebase(logout);
