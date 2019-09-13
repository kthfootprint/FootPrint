import React, { Component } from "react";
import RouteCard from "./routecard";
import DotLoader from "react-spinners/DotLoader";
import logo from "../styles/foot.png";
import InfoView from "./infoview";
import handleRoute from "./RouteTools/handleRoute";
import { withAuthorization } from "./Auth";
import * as ROLES from "../constants/roles";
import { CSSTransition } from "react-transition-group";
/* global google */

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

  autoFill = () => {
    this.originFill();
    var originInput = document.getElementById("origin-input");
    var destinationInput = document.getElementById("destination-input");
    originInput.addEventListener("click", originInput.select);
    destinationInput.addEventListener("click", destinationInput.select);
    var destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput
    );
    destinationAutocomplete.setFields(["place_id"]);
    destinationAutocomplete.setComponentRestrictions({ country: "se" });
    destinationAutocomplete.addListener("place_changed", () => {
      this.setDestination(destinationInput.value);
      destinationInput.value = destinationInput.value.split(",")[0];
    });
  };

  originFill = () => {
    var originInput = document.getElementById("origin-input");
    originInput.removeEventListener("click", this.originFill);
    var geolocation = {
      lat: 59.334591,
      lng: 18.06324
    };
    var circle = new google.maps.Circle({
      center: geolocation,
      radius: 150000
    });

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    originAutocomplete.setFields(["place_id"]);
    originAutocomplete.setBounds(circle.getBounds());
    originAutocomplete.setComponentRestrictions({ country: "se" });
    originAutocomplete.addListener("place_changed", () => {
      this.setOrigin(originInput.value);
      originInput.value = originInput.value.split(",")[0];
    });
  };

  setOrigin = e => {
    this.setState({ orig: e });
  };

  setDestination = e => {
    this.setState({ dest: e });
  };

  setPosition = position => {
    var originInput = document.getElementById("origin-input");
    var destinationInput = document.getElementById("destination-input");
    let pos = position.coords.latitude + ", " + position.coords.longitude;
    this.setState({ orig: pos }, () => {
      originInput.addEventListener("click", this.originFill);
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

  componentDidMount() {
    this.autoFill();
  }

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

  render() {
    return (
      <div>
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
                />
                <span className="label">Start</span>
                <span className="label" id="location">
                  <i
                    onClick={this.getLocation}
                    className="fas fa-crosshairs fa-lg"
                  ></i>
                </span>
              </label>

              <label className="inp">
                <input id="destination-input" type="text" placeholder=" " />
                <span className="label">Destination</span>
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
            css={{ flex: 1, marginTop: 50, alignSelf: "center" }}
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

export default withAuthorization(condition)(SearchView);
