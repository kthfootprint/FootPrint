import React, { Component } from "react";
import { compose } from "recompose";
import { withFirebase } from "./Firebase";
import RouteCard from "./routecard";
import DotLoader from "react-spinners/DotLoader";
import logo from "../styles/foot.png";
import InfoView from "./infoview";
import handleRoute from "./RouteTools/handleRoute";
import { withAuthorization } from "./Auth";
import * as ROLES from "../constants/roles";
import { CSSTransition } from "react-transition-group";
/* global google */

import "../styles/searchview.scss";

class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeList: [],
      orig: "",
      dest: "",
      route: [],
      loading: false,
      bgBlur: false,
      showHeader: true
    };
    this.toggleHeader = this.toggleHeader.bind(this);
  }

  initAutocomplete = inputField => {
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
    var destinationInput = document.getElementById("destination-input");
    let pos = position.coords.latitude + ", " + position.coords.longitude;
    this.setState({ orig: pos }, () => {
      destinationInput.select();
    });
  };

  getLocation = () => {
    var originInput = document.getElementById("origin-input");
    var destinationInput = document.getElementById("destination-input");
    google.maps.event.clearInstanceListeners(originInput);
    originInput.value = "My location";
    destinationInput.focus();

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
    this.initAutocomplete(event.target);
  };

  setDestination = event => {
    this.setState({ dest: event.value });
    event.value = event.value.split(",")[0];
  };

  setOrigin = event => {
    this.setState({ orig: event.value });
    event.value = event.value.split(",")[0];
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
                />
                <span className="label">From</span>
                <span className="label" id="location">
                  <i
                    onClick={this.getLocation}
                    className="fas fa-location-arrow"
                  ></i>
                </span>
              </label>

              <label className="inp">
                <input
                  id="destination-input"
                  type="text"
                  placeholder=" "
                  onFocus={this.inputFocus}
                />
                <span className="label">To</span>
              </label>
            </nav>

            <nav id="goBtn">
              <button type="button" className="btn" onClick={this.findRoute}>
                <img id="goLogo" src={logo} alt="" />
                Go!
              </button>
            </nav>
          </header>
        </CSSTransition>
        <div id="main">
          <DotLoader
            css={{ marginTop: 50, alignSelf: "center" }}
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
