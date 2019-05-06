import React, { Component } from 'react';
import RouteCard from './routecard';
import DotLoader from 'react-spinners/DotLoader';
/* global google */

class SearchHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeList: [],
      orig: '',
      dest: '',
      route: [],
      loading: false
    };

  }

  autoFill = () => {
    this.originFill();
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    originInput.addEventListener("click", originInput.select);
    destinationInput.addEventListener("click", destinationInput.select);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
    destinationAutocomplete.setFields(['place_id']);
    destinationAutocomplete.addListener('place_changed', () => {
      this.setDestination(destinationInput.value);
      destinationInput.value = destinationInput.value.split(',')[0];
    });
  }

  originFill = () => {
    var originInput = document.getElementById('origin-input');
    originInput.removeEventListener("click", this.originFill);
    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    originAutocomplete.setFields(['place_id']);
    originAutocomplete.addListener('place_changed', () => {
      this.setOrigin(originInput.value);
      originInput.value = originInput.value.split(',')[0];
    });
  }

  setOrigin = (e) => {
    this.setState({ orig: e });
  }

  setDestination = (e) => {
    this.setState({ dest: e });
  }

  setPosition = (position) => {
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    let pos = position.coords.latitude + ', ' + position.coords.longitude;
    this.setState({ orig: pos }, () => {
      originInput.addEventListener("click", this.originFill);
      destinationInput.select();
    });
  }

  getLocation = () => {
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    google.maps.event.clearInstanceListeners(originInput);
    originInput.value = 'My location';
    destinationInput.focus();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition);
    } else {
      document.getElementById('main').innerHTML = 'Geolocation is not supported by this browser.';
    }
  }

  componentDidMount() {
    this.autoFill();
  }

  findRoute = () => {
    var routeList = [];
    this.setState({ loading: true });

    fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + this.state.orig + "&destination=" + this.state.dest + "&mode=transit&alternatives=true&key=AIzaSyC8nThaZKU2HvY_tKlPrEIeZRtlHpHWOy0")
      .then(res => res.json())
      .then(
        (result) => {
          for (var r in result.routes) {
            var transitInfo = [];
            var typeTime = [];
            for (var t in result.routes[r].legs[0].steps) {
              var step = result.routes[r].legs[0].steps[t];
              if (step.transit_details) {
                transitInfo.push({
                  type: step.transit_details.line.vehicle.type,
                  from: step.transit_details.departure_stop,
                  to: step.transit_details.arrival_stop,
                  line: step.transit_details.line.short_name,
                  lineColor: step.transit_details.line.color
                })
              } else {
                if (transitInfo.length < 1) {
                  transitInfo.push({
                    type: step.travel_mode,
                    from: this.state.orig,
                    to: result.routes[r].legs[0].steps[parseInt(t)+1].transit_details.arrival_stop,
                    line: null,
                    lineColor: '#000000'
                  })
                } else {
                  transitInfo.push({
                    type: step.travel_mode,
                    from: result.routes[r].legs[0].steps[parseInt(t)-1].transit_details.departure_stop,
                    to: this.state.dest,
                    line: null,
                    lineColor: '#000000'
                  })
                }
              }
              typeTime.push(step.duration.value);
            }
            var depart = result.routes[r].legs[0].departure_time ? result.routes[r].legs[0].departure_time.text : "";
            var arrive = result.routes[r].legs[0].arrival_time ? result.routes[r].legs[0].arrival_time.text : "";
            var totalTimeStr = result.routes[r].legs[0].duration.text;
            var route = { departure: depart, arrival: arrive, duration: totalTimeStr, typeLength: typeTime, transitInfo: transitInfo, index: r };
            routeList.push(route);
          }
          routeList.sort(function (a, b) {
            return a.transitTime - b.transitTime;
          });
          this.setState({ routeList: routeList, route: result.routes, loading: false });
        },
        (error) => {
          this.setState({
            loading: false,
            error
          });
        }
      )
  }

  render() {
    return (
      <div>
        <header>
          <nav id="searchField">
            <label className="inp">
              <input id="origin-input" className="controls" type="text" placeholder=" " />
              <span className="label">Start</span>
              <span className="label" id="location"><i onClick={this.getLocation} className="fas fa-crosshairs fa-lg"></i></span>
            </label>

            <label className="inp">
              <input id="destination-input" type="text" placeholder=" " />
              <span className="label">Destination</span>
            </label>
          </nav>

          <nav id="goBtn">
            <button type="button" className="btn" onClick={this.findRoute}><i className="fas fa-shoe-prints fa-2x"></i>Go!</button>
          </nav>
        </header>
        <div id="main">
          <DotLoader css={{flex: 1, marginTop:50, alignSelf:'center'}} loading={this.state.loading}/>
          {!this.state.loading && <RouteCard list={this.state.routeList} route={this.state.route} />}
        </div>
        {/* <GoogleApiWrapper list={this.state.routeList}/> */}
      </div>
    );
  }
}

export default SearchHeader;