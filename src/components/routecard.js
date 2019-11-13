import React, { Component } from "react";
import DirectionOverlay from "./directionoverlay";
import { withFirebase } from "./Firebase";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWalking,
  faBus,
  faSubway,
  faTrain,
  faShip
} from "@fortawesome/free-solid-svg-icons";

import "../styles/routecard.scss";

export class RouteCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      route: [],
      overlay: false,
      emission: 0,
      comparable: 0,
      emissionColor: "rgb(0,200,0)",
      showCard: false
    };
  }

  componentDidMount() {
    this.toggleCard(true);
  }

  calculateComparable = transit => {
    let comparableOut = 0;
    const eCar = 101.7 / 1000;
    for (let i = 0; i < transit.length; i++) {
      let distance = transit[i].distance.value;
      comparableOut += distance * eCar;
    }
    return Math.round(comparableOut * 100) / 100;
  };

  emissionList = emList => {
    let unsortedEmissions = [];
    for (let i = 0; i < emList.length; i++) {
      unsortedEmissions.push(
        this.props.firebase.calculateEmission(emList[i].transitInfo)
      );
    }
    return unsortedEmissions.sort();
  };

  emissionColor = (sortedEm, compare) => {
    let red = 0;
    let x = 0;
    if (sortedEm[0] !== sortedEm[sortedEm.length - 1]) {
      x =
        (compare - sortedEm[0]) / (sortedEm[sortedEm.length - 1] - sortedEm[0]);
      red = x * 255;
    }
    return "rgb(" + red + ",200,0)";
  };

  getEmissionObject = (emission, color) => {
    return (
      <div className="emission">
        <p className="emissionHeader">Emission | </p>
        <p style={{ color: color }}>{emission} g CO2</p>
      </div>
    );
  };

  getRGBA(color) {
    return color.slice(0, 3) + "a" + color.slice(3, -1) + ")";
  }

  selectCard = e => {
    if (this.props.list[e.target.id]) {
      this.props.toggle(false);
      this.toggleCard(false);
      var r = this.props.list[e.target.id].index;
      let calculatedEmission = this.props.firebase.calculateEmission(
        this.props.list[e.target.id].transitInfo
      );
      let calculatedComparable = this.calculateComparable(
        this.props.list[e.target.id].transitInfo
      );
      let emissionColorValue = this.emissionColor(
        this.emissionList(this.props.list),
        calculatedEmission
      );
      this.props.firebase.selectedIndex = e.target.id;
      this.setState({
        overlay: true,
        route: this.props.route[r],
        emission: calculatedEmission,
        comparable: calculatedComparable,
        emissionColor: emissionColorValue
      });
    }
  };

  removeOverlay = () => {
    this.setState({ overlay: false });
    this.props.toggle(true);
    this.toggleCard(true);
  };

  getIcon = transport => {
    var subway = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="16"
        height="16"
        viewBox="0 0 500 500"
      >
        <circle
          cx="250"
          cy="250"
          r="239"
          stroke="#000"
          strokeWidth="22"
          fill="#fff"
        />
        <path d="M92,138.5h316v79.5h-118.25v194h-79.5v-194h-118.25z" />
      </svg>
    );
    var icon = {
      WALKING: faWalking,
      BUS: faBus,
      SUBWAY: faSubway,
      TRAIN: faTrain,
      HEAVY_RAIL: faTrain,
      LONG_DISTANCE_TRAIN: faTrain,
      HIGH_SPEED_TRAIN: faTrain,
      TRAM: faSubway,
      FERRY: faShip
    };
    return transport.type === "SUBWAY" ? (
      subway
    ) : (
      <FontAwesomeIcon
        icon={icon[transport.type]}
        style={{ color: transport.lineColor }}
      />
    );
  };

  toggleCard(value) {
    this.setState({ showCard: value });
  }

  getRouteSteps = route => {
    var travelSteps = [];
    route.transitInfo.forEach((step, index) => {
      var routeNr = this.getRouteNr(step);
      var routeColor = this.getRouteColor(step);
      if (travelSteps.length < 5) {
        travelSteps.push(
          <div className="routeSteps" key={index}>
            {this.getIcon(step)}
            <p className="routeId" style={{ backgroundColor: routeColor }}>
              {routeNr}
            </p>
          </div>
        );
      } else if (travelSteps.length === 5) {
        travelSteps.push(
          <div className="routeSteps" key={index}>
            <p className="routeId">...</p>
          </div>
        );
      }
    });
    return travelSteps;
  };

  getRouteNr = transitInfo => {
    return transitInfo.type === "TRAM"
      ? "Tvärbanan " + transitInfo.line
      : transitInfo.type === "WALKING"
      ? transitInfo.distance.text
      : transitInfo.line;
  };

  getRouteColor = transitInfo => {
    return transitInfo.type === "WALKING" ? null : transitInfo.lineColor;
  };

  render() {
    var calculatedEmission = 0;
    var emissionColorValue = 0;
    var emissionObject = "";
    var card = [];
    var list = this.props.list;
    var emissions = this.emissionList(list);

    list.forEach((route, index) => {
      var rand = Math.random() * 100 + 50;
      calculatedEmission = this.props.firebase.calculateEmission(
        route.transitInfo
      );
      emissionColorValue = this.emissionColor(emissions, calculatedEmission);
      emissionObject = this.getEmissionObject(
        calculatedEmission,
        emissionColorValue
      );

      var travelSteps = this.getRouteSteps(route);

      card.push(
        <CSSTransition
          in={this.state.showCard}
          timeout={rand}
          classNames="fade"
          unmountOnExit
          key={route.index}
        >
          <article
            key={route.index}
            className="card"
            id={index}
            onClick={this.selectCard}
          >
            <div
              className="top"
              style={{ backgroundColor: this.getRGBA(emissionColorValue) }}
            >
              <div className="routeContainer">
                <div className="travel">{travelSteps}</div>
                <div className="rightCard">
                  <div className="time">
                    <p>{route.duration}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="timeContainer">
                {route.departure !== "" ? (
                  <p>
                    {route.departure} - {route.arrival}
                  </p>
                ) : (
                  <p>{route.duration}</p>
                )}
                {emissionObject}
              </div>
            </div>
          </article>
        </CSSTransition>
      );
    });
    return (
      <div className="routeCards" style={{ width: "100%" }}>
        {card}
        <CSSTransition
          in={this.state.overlay}
          timeout={300}
          classNames="slideUp"
          unmountOnExit
        >
          <DirectionOverlay
            route={this.state.route}
            emission={this.state.emission}
            comparable={this.state.comparable}
            emissionColor={this.state.emissionColor}
            unmount={this.removeOverlay}
          />
        </CSSTransition>
      </div>
    );
  }
}

export default withFirebase(RouteCard);
