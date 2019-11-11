import React, { Component } from "react";
import { compose } from "recompose";
import { withFirebase } from "./Firebase";
import RouteCard from "./routecard";
import Logout from "./logout";
import DotLoader from "react-spinners/DotLoader";
import logo from "../styles/foot.png";
import InfoView from "./infoview";
import handleRoute from "./RouteTools/handleRoute";
import { withAuthorization } from "./Auth";
import * as ROLES from "../constants/roles";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt, faCrosshairs } from "@fortawesome/free-solid-svg-icons";
/* global google */

import "../styles/searchview.scss";

class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeList: [],
      orig: "",
      dest: "",
      origName: "",
      destName: "",
      route: [],
      loading: false,
      bgBlur: true,
      showHeader: true,
      flipped: 90,
      location: ""
    };
    this.toggleHeader = this.toggleHeader.bind(this);
  }

  componentDidMount() {
    this.getLocation("origin-input");
    /*     var orig = document.getElementById("origin-input");
    var dest = document.getElementById("destination-input");
    this.initAutocomplete(orig);
    this.initAutocomplete(dest); */
  }

  initAutocomplete = inputField => {
    google.maps.event.clearInstanceListeners(inputField);
    var geolocation = {
      lat: 59.334591,
      lng: 18.06324
    };
    var circle = new google.maps.Circle({
      center: geolocation,
      radius: 150000
    });
    var autocomplete = new google.maps.places.Autocomplete(inputField);
    autocomplete.setFields(["place_id"]);
    autocomplete.setBounds(circle.getBounds());
    autocomplete.setComponentRestrictions({ country: "se" });
    autocomplete.addListener("place_changed", () => {
      inputField.id === "origin-input"
        ? this.setOrigin(inputField)
        : this.setDestination(inputField);
    });
  };

  setPosition = position => {
    var activeInput = document.getElementById(this.state.location);
    let pos = position.coords.latitude + ", " + position.coords.longitude;

    activeInput === "origin-input"
      ? this.setState({ orig: pos })
      : this.setState({ dest: pos });
  };

  getLocation = () => {
    var activeInput = document.getElementById(this.state.location);

    activeInput === "origin-input"
      ? this.setState({ origName: "My location" })
      : this.setState({ destName: "My location" });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition);
    } else {
      document.getElementById("main").innerHTML =
        "Geolocation is not supported by this browser.";
    }
  };

  findRoute = () => {
    var routeList = [];
    this.setState({ loading: true });

    fetch(
      "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" +
        this.state.orig +
        "&destination=" +
        this.state.dest +
        "&mode=transit&alternatives=true&key=AIzaSyC8nThaZKU2HvY_tKlPrEIeZRtlHpHWOy0"
    )
      .then(res => res.json())
      .then(
        result => {
          routeList = handleRoute(result, [], this.state.orig, this.state.dest);
          routeList.sort(function(a, b) {
            return a.transitTime - b.transitTime;
          });
          this.setState({
            routeList: routeList,
            route: result.routes,
            loading: false,
            bgBlur: true
          });

          this.props.firebase.orig = this.state.orig;
          this.props.firebase.dest = this.state.dest;
          this.props.firebase.routeList = routeList;
        },
        error => {
          this.setState({
            loading: false,
            error
          });
        }
      );
  };

  toggleHeader(value) {
    this.setState({ showHeader: value });
  }

  inputFocus = event => {
    event.target.select();
    // console.log(event.target.value);
    this.setState({ location: event.target.id });
    this.initAutocomplete(event.target);
  };

  setDestination = event => {
    this.setState({ dest: event.value });
    this.setState({ destName: this.state.dest.split(",")[0] });
  };

  inputDestination = event => {
    this.setState({ dest: event.target.value });
    this.setState({ destName: event.target.value });
  };

  setOrigin = event => {
    this.setState({ orig: event.value });
    this.setState({ origName: this.state.orig.split(",")[0] });
  };

  inputOrig = event => {
    this.setState({ orig: event.target.value });
    this.setState({ origName: event.target.value });
  };

  flipRoute = () => {
    this.setState(prevState => ({
      orig: prevState.dest,
      dest: prevState.orig,
      origName: prevState.destName,
      destName: prevState.origName,
      flipped: this.state.flipped === 90 ? 270 : 90
    }));
  };

  render() {
    return (
      <div className="searchView">
        <div className={this.state.bgBlur ? "blurImg" : "bgImg"}></div>
        <CSSTransition
          in={this.state.showHeader}
          timeout={300}
          classNames="slideDown"
          unmountOnExit
        >
          <header>
            <nav id="searchField">
              <label className="inp">
                <input
                  id="origin-input"
                  className="controls"
                  type="text"
                  placeholder=" "
                  onFocus={this.inputFocus}
                  value={this.state.origName}
                  onChange={this.inputOrig}
                  onBlur={() => this.setState({ location: false })}
                />
                <span className="label">From</span>
              </label>

              <label className="inp">
                <input
                  id="destination-input"
                  type="text"
                  placeholder=" "
                  onFocus={this.inputFocus}
                  value={this.state.destName}
                  onChange={this.inputDestination}
                  onBlur={() => this.setState({ location: false })}
                />
                <span className="label">To</span>
              </label>

              {this.state.location !== "" && (
                <div className="myLocation" onMouseDown={this.getLocation}>
                  <FontAwesomeIcon icon={faCrosshairs} />
                  <p>My location</p>
                </div>
              )}
            </nav>

            <nav id="switchRoute">
              <button
                type="button"
                className="btn"
                onClick={this.flipRoute}
                tabIndex="-1"
              >
                <FontAwesomeIcon
                  icon={faExchangeAlt}
                  rotation={this.state.flipped}
                  style={{ color: "rgb(200, 200, 200)" }}
                />
              </button>
            </nav>

            <nav id="goBtn">
              <button
                type="button"
                className="btn"
                onClick={this.findRoute}
                disabled={this.state.orig === this.state.dest}
              >
                <img id="goLogo" src={logo} alt="" />
                Go!
              </button>
            </nav>
          </header>
        </CSSTransition>
        <div id="main">
          <DotLoader
            css={{
              marginTop: 50,
              alignSelf: "center"
            }}
            loading={this.state.loading}
          />
          {!this.state.loading &&
            (this.state.routeList.length === 0 ? (
              <InfoView />
            ) : (
              <RouteCard
                list={this.state.routeList}
                route={this.state.route}
                toggle={this.toggleHeader}
              />
            ))}
          <CSSTransition
            in={this.state.showHeader}
            timeout={300}
            classNames="slideUp"
            unmountOnExit
          >
            <Logout />
          </CSSTransition>
        </div>
      </div>
    );
  }
}

const condition = authUser =>
  authUser &&
  ((authUser.roles && !!authUser.roles[ROLES.USER]) ||
    (authUser.authUser &&
      authUser.authUser.roles &&
      !!authUser.authUser.roles[ROLES.USER]));

export default compose(
  withAuthorization(condition),
  withFirebase
)(SearchView);
