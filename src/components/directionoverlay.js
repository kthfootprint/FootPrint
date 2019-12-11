import React, { Component } from "react";
import RouteMap from "./routemap";
import DirectionDetails from "./directiondetails";
import EmissionCalculationView from "./emissioncalculationview";
import Swipe from "react-easy-swipe";
import { withFirebase } from "./Firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import "../styles/directionoverlay.scss";

class DirectionOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showECV: false
    };
  }
  componentDidMount() {
    this.props.firebase.setSelectedRoute(this.props.route.legs[0]);
  }
  goBack = () => {
    this.props.unmount();
  };

  checkSwipe = (pos, event) => {
    if (
      event.target.id === "directionDetails" ||
      event.target.id === "slider"
    ) {
      this.goBack();
    }
  };

  toggleECV = () => {
    this.setState({
      showECV: !this.state.showECV
    });
  };

  render() {
    return (
      <div id="overlay">
        {this.state.showECV ? (
          <EmissionCalculationView toggleECV={this.toggleECV} />
        ) : null}
        <div className="map">
          <RouteMap
            route={this.props.route}
            emissionColor={this.props.emissionColor}
          />
        </div>
        <Swipe onSwipeDown={this.checkSwipe}>
          <div id="backBtn" onClick={this.goBack}>
            <FontAwesomeIcon size="2x" icon={faArrowDown} />
          </div>
          <DirectionDetails
            route={this.props.route.legs[0]}
            emission={this.props.emission}
            comparable={this.props.comparable}
            emissionColor={this.props.emissionColor}
            toggleECV={this.toggleECV}
          />
        </Swipe>
      </div>
    );
  }
}
export default withFirebase(DirectionOverlay);
