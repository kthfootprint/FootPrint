import React, { Component } from "react";
import DirectionOverlay from "./directionoverlay";
import Comparison from "./comparison";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWalking,
  faBus,
  faSubway,
  faTrain,
  faShip
} from "@fortawesome/free-solid-svg-icons";

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

  calculateEmission = transit => {
    let emissionOut = 0;
    const eBus = 8 / 1000;
    const eSub = 0.16 / 1000;
    for (let i = 0; i < transit.length; i++) {
      let distance = transit[i].distance.value;
      if (transit[i].type === "BUS" || transit[i].type === "FERRY") {
        emissionOut += distance * eBus;
      } else if (
        transit[i].type === "SUBWAY" ||
        transit[i].type === "TRAIN" ||
        transit[i].type === "TRAM"
      ) {
        emissionOut += distance * eSub;
      }
    }
    return Math.round(emissionOut * 100) / 100;
  };

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
      unsortedEmissions.push(this.calculateEmission(emList[i].transitInfo));
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
        <p style={{ color: color }}>{emission} g CO2</p>
      </div>
    );
  };

  getRGBA(color) {
    return color.slice(0, 3) + "a" + color.slice(3, -1) + ",0.3)";
  }

  selectCard = e => {
    this.props.toggle(false);
    this.toggleCard(false);
    if (this.props.list[e.target.id]) {
      var r = this.props.list[e.target.id].index;
      let calculatedEmission = this.calculateEmission(
        this.props.list[e.target.id].transitInfo
      );
      let calculatedComparable = this.calculateComparable(
        this.props.list[e.target.id].transitInfo
      );
      let emissionColorValue = this.emissionColor(
        this.emissionList(this.props.list),
        calculatedEmission
      );
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

  render() {
    var calculatedEmission = 0;
    var calculatedComparable = "";
    var emissionColorValue = 0;
    var emissionObject = "";
    var card = [];
    var list = this.props.list;
    var emissions = this.emissionList(list);
    for (var i in list) {
      var rand = Math.random() * 100 + 50;
      calculatedEmission = this.calculateEmission(list[i].transitInfo);
      calculatedComparable = this.calculateComparable(list[i].transitInfo);
      emissionColorValue = this.emissionColor(emissions, calculatedEmission);
      emissionObject = this.getEmissionObject(
        calculatedEmission,
        emissionColorValue
      );
      var travelSteps = [];
      for (let t = 0; t < list[i].transitInfo.length; t++) {
        var routeNr =
          list[i].transitInfo[t].type === "TRAM"
            ? "Tvärbanan " + list[i].transitInfo[t].line
            : list[i].transitInfo[t].type === "WALKING"
            ? list[i].transitInfo[t].distance.text
            : list[i].transitInfo[t].line;
        var routeColor =
          list[i].transitInfo[t].type === "WALKING"
            ? null
            : list[i].transitInfo[t].lineColor;
        travelSteps.push(
          <div className="routeSteps" key={t}>
            {this.getIcon(list[i].transitInfo[t])}
            <p className="routeId" style={{ backgroundColor: routeColor }}>
              {routeNr}
            </p>
          </div>
        );
      }
      card.push(
        <CSSTransition
          in={this.state.showCard}
          timeout={rand}
          classNames="fade"
          unmountOnExit
          key={list[i].index}
        >
          <article
            key={list[i].index}
            className="card"
            id={i}
            onClick={this.selectCard}
            style={{ backgroundColor: this.getRGBA(emissionColorValue) }}
          >
            <div className="top">
              <div className="routeContainer">
                <div className="travel">{travelSteps}</div>
                <div className="rightCard">
                  <div className="time">
                    <p>{list[i].duration}</p>
                  </div>
                  {emissionObject}
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="timeContainer">
                {list[i].departure !== "" && (
                  <p>
                    {list[i].departure} - {list[i].arrival}
                  </p>
                )}
                <Comparison comparableNumber={calculatedComparable} />
              </div>
            </div>
          </article>
        </CSSTransition>
      );
    }
    // this.toggleCard()
    return (
      <div style={{ width: "100%" }}>
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

export default RouteCard;
