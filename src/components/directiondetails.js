import React, { Component } from "react";
import { withFirebase } from "./Firebase";
import Comparison from "./comparison";
import styled from "styled-components";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWalking, faBus, faSubway, faTrain, faBusAlt, faShip } from "@fortawesome/free-solid-svg-icons";

export class DirectionDetails extends Component {
  emissionBox = () => {
    return (
      <div className="emissionBox">
        <div className="emission" style={{ color: this.props.emissionColor }}>
          <p>Your trip emits: {this.props.emission} g CO2</p>
        </div>
        <Comparison comparableNumber={this.props.comparable} />
      </div>
    );
  };

  render() {
    const steps = this.props.route.steps;
    const icon = {
      WALKING: <FontAwesomeIcon icon={faWalking} />,
      BUS: <FontAwesomeIcon icon={faBus} />,
      SUBWAY: <FontAwesomeIcon icon={faSubway} />,
      TRAIN: <FontAwesomeIcon icon={faTrain} />,
      TRAM: <FontAwesomeIcon icon={faBusAlt} />,
      FERRY: <FontAwesomeIcon icon={faShip} />,
    };
    let allSteps = [];
    for (var i in steps) {
      allSteps.push(
        <div key={"direction" + i}>
          <div className="transitDetails">
            <div className="stepDetailTime">
              {
                icon[
                steps[i].transit_details
                  ? steps[i].transit_details.line.vehicle.type
                  : steps[i].travel_mode
                ]
              }
              {steps[i].transit_details
                ? steps[i].transit_details.departure_time.text
                : ""}
            </div>
          </div>
          <p className="stepDetailInstructions">
            {this.props.route.steps[i].html_instructions} (
            {this.props.route.steps[i].distance.value} m)
          </p>
        </div>
      );
    }
    return (
      <div id="directionDetails">
        <div id="slider"></div>
        <DirectionSteps>{allSteps}</DirectionSteps>
        <hr style={{ borderWidth: "1.5px", width: "100%" }} />
        {this.emissionBox()}
        {console.log(this.props)}
        <Button
          onClick={() => {
            this.props.firebase.setSelectedRoute(this.props.route).then(() => {
              alert("SAAAAAAVED");
            });
          }}
          variant="success"
          className="saveButton"
        >
          Save route
        </Button>
      </div>
    );
  }
}

const DirectionSteps = styled.div`
  margin: 2px 10px 0 10px;
  overflow: scroll;
  padding: 0 2.5px 0 2.5px;
  font-size: 0.7em;
  height: 40%;
  div {
    margin: 0.5em;
  }
  .stepDetailTime {
    width: 15%;
    margin: 0em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #5e6960;
  }
`;

export default withFirebase(DirectionDetails);
