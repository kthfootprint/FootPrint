import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

export default class logout extends Component {
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
      <div className={"logout " + (this.state.show ? "open" : "")}>
        <div className="optionIcon" onClick={this.toggle}>
          <FontAwesomeIcon icon={faCog} size="2x" color="white" />
        </div>
        <div
          className="signOut"
          hidden={!this.state.show} /* onClick={this.toggle} */
        >
          <p>Sign out</p>
        </div>
      </div>
    );
  }
}
