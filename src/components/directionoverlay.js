import React, { Component } from "react";
import RouteMap from "./routemap";
import DirectionDetails from "./directiondetails";
import Swipe from "react-easy-swipe";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import "../styles/directionoverlay.scss";

class DirectionOverlay extends Component {
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

  render() {
    return (
      <div id="overlay">
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
          />
        </Swipe>
      </div>
    );
  }
}
export default DirectionOverlay;
