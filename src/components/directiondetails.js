import React, { Component } from "react";
import { withFirebase } from "./Firebase";
import Comparison from "./comparison";
import { filterOutShortWalks } from "./RouteTools/handleRoute";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWalking,
  faBus,
  faSubway,
  faTrain,
  faShip
} from "@fortawesome/free-solid-svg-icons";

export class DirectionDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saveButtonVariant: "success",
      saveButtonText: "Save route"
    };
  }
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
    let steps = this.props.route.steps;
    if (filterOutShortWalks(this.props.route)) {
      steps.pop();
    }
    const icon = {
      WALKING: <FontAwesomeIcon icon={faWalking} />,
      BUS: <FontAwesomeIcon icon={faBus} />,
      SUBWAY: <FontAwesomeIcon icon={faSubway} />,
      TRAIN: <FontAwesomeIcon icon={faTrain} />,
      HEAVY_RAIL: <FontAwesomeIcon icon={faTrain} />,
      LONG_DISTANCE_TRAIN: <FontAwesomeIcon icon={faTrain} />,
      HIGH_SPEED_TRAIN: <FontAwesomeIcon icon={faTrain} />,
      TRAM: <FontAwesomeIcon icon={faSubway} />,
      FERRY: <FontAwesomeIcon icon={faShip} />
    };
    let allSteps = [];
    for (var i in steps) {
      allSteps.push(
        <div key={"direction" + i}>
          <div className="transitDetails">
            <div className="stepDetailTime">
              <Col xs={1} className="timeText">
                {steps[i].transit_details
                  ? steps[i].transit_details.departure_time.text
                  : ""}
              </Col>
              <Col xs={1}>
                {
                  icon[
                    steps[i].transit_details
                      ? steps[i].transit_details.line.vehicle.type
                      : steps[i].travel_mode
                  ]
                }
              </Col>
              <Col className="instructionText">
                <p className="stepDetailInstructions">
                  {this.props.route.steps[i].html_instructions} (
                  {this.props.route.steps[i].distance.value} m)
                </p>
              </Col>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div id="directionDetails">
        <div id="slider"></div>
        <DirectionSteps>{allSteps}</DirectionSteps>
        <hr style={{ borderWidth: "1.5px", width: "100%" }} />
        {this.emissionBox()}
        <Button
          onClick={() => {
            this.setState({
              saveButtonVariant: "info",
              saveButtonText: "Saving..."
            });
            this.props.firebase.setSelectedRoute(this.props.route).then(() => {
              this.setState({
                saveButtonVariant: "secondary",
                saveButtonText: "Route saved!"
              });
            });
          }}
          variant={this.state.saveButtonVariant}
          className="saveButton"
          disabled={this.state.saveButtonVariant === "secondary" ? true : false}
        >
          {this.state.saveButtonText}
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
  width: 90%;
  div {
    margin: 0.5em;
  }
  .stepDetailTime {
    margin: 0em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #5e6960;
  }
`;

export default withFirebase(DirectionDetails);
