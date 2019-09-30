import React, { Component } from "react";
import RouteMap from "./routemap";
import DirectionDetails from "./directiondetails";
import Swipe from "react-easy-swipe";

import "../styles/directionoverlay.scss";

class DirectionOverlay extends Component {
  goBack = () => {
    this.props.unmount();
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
        <Swipe onSwipeDown={this.goBack}>
          <div id="backBtn" onClick={this.goBack}>
            <i className="fas fa-arrow-down fa-2x"></i>
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
