import React from 'react';
import RouteCard from './components/routecard.js';
/* global google */

class SearchHeader extends React.Component {

  componentDidMount() {
    var orig = "";
    const findRoute = () => {
      var dest = document.getElementById('destination-input').value;
      var start = document.getElementById('origin-input').value;
      if (start != 'My location') {
          orig = document.getElementById('origin-input').value;
      }
      var routeList = [];

    fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + orig + "&destination=" + dest + "&mode=transit&alternatives=true&key=AIzaSyC8nThaZKU2HvY_tKlPrEIeZRtlHpHWOy0")
      .then(res => res.json())
      .then(
        (result) => {
          /* this.setState({
            isLoaded: true,
            items: result.items
          }); */

          console.log(result.routes[0]);
                for (var r in result.routes) {
                    var tType = [];
                    var typeTime = [];
                    var tTime = 0;
                    for (var t in result.routes[r].legs[0].steps) {
                        var step = result.routes[r].legs[0].steps[t];
                        if (step.transit_details) {
                            tTime += step.duration.value;
                            tType.push(step.transit_details.line.vehicle.type);
                            typeTime.push(step.duration.value);
                        } else {
                            tType.push(step.travel_mode);
                            typeTime.push(step.duration.value);
                        }
                    }
                    var depart = result.routes[r].legs[0].departure_time.text;
                    var arrive = result.routes[r].legs[0].arrival_time.text;
                    var totalTime = result.routes[r].legs[0].duration.text;

                    var route = { departure: depart, arrival: arrive, duration: totalTime, type: tType, typeLength: typeTime, transitTime: tTime };
                    routeList.push(route);
                }
                routeList.sort(function (a, b) {
                    return a.transitTime - b.transitTime;
                });
                drawRoute(routeList);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  }

  render() {
    var icon = {
      "WALKING": '<i className="fas fa-walking"></i>',
      "BUS": '<i className="fas fa-bus"></i>',
      "SUBWAY": '<i className="fas fa-subway"></i>',
      "TRAIN": '<i className="fas fa-train"></i>',
      "TRAM": '<i className="fas fa-bus-alt"></i>',
      "FERRY": '<i className="fas fa-ship"></i>'
    };
    

    document.addEventListener("DOMContentLoaded", function () {
      autoFill();
      document.getElementById('origin-input').onclick = function () {
        if (this.value === "My location") {
          this.value = " ";
        }
      };
    });

    const drawRoute = (list) => {
      document.getElementById('main').innerHTML = "";
      for (var i in list) {
        var travelSteps = "";
        for (var t in list[i].type) {
          if (t > 0) {
            travelSteps += '<i className="fas fa-chevron-right fa-xs"></i>' + icon[list[i].type[t]] + '<p><sub>' + Math.round(list[i].typeLength[t] / 60) + '</sub></p>';
          } else {
            travelSteps += icon[list[i].type[t]] + '<p><sub>' + Math.round(list[i].typeLength[t] / 60) + '</sub></p>';
          }

        }
        document.getElementById('main').innerHTML += '<article className="card"><div className="top"><div className="travel">' + travelSteps + '</div><div className="emission"><p>100 CO2</p></div><div className="time"><p>' + list[i].duration + '</p></div></div><div className="bottom"><p>' + list[i].departure + ' - ' + list[i].arrival + '</p></div></article>';
      }
    }

    const autoFill = () => {
      var originInput = document.getElementById('origin-input');
      var destinationInput = document.getElementById('destination-input');

      var originAutocomplete = new google.maps.places.Autocomplete(originInput);
      originAutocomplete.setFields(['place_id']);

      var destinationAutocomplete =
        new google.maps.places.Autocomplete(destinationInput);
      destinationAutocomplete.setFields(['place_id']);
    }

    const getLocation = () => {
      var originInput = document.getElementById('origin-input');
      var destinationInput = document.getElementById('destination-input');
      originInput.value = "My location";
      destinationInput.value = ' ';
      destinationInput.select();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
      } else {
        document.getElementById('main').innerHTML = "Geolocation is not supported by this browser.";
      }
    }

    const setPosition = (position) => {
      orig = position.coords.latitude + ', ' + position.coords.longitude;
    }

    return (
      <header>
        <nav id="searchField">
          <label className="inp">
            <input id="origin-input" className="controls" type="text" placeholder="&nbsp;" />
            <span className="label">Start</span>
            <span className="label" id="location"><i onClick={getLocation} className="fas fa-crosshairs fa-lg"></i></span>
          </label>

          <label className="inp">
            <input id="destination-input" type="text" placeholder="&nbsp;" />
            <span className="label">Destination</span>
          </label>
        </nav>

        <nav id="goBtn">
          <button type="button" className="btn" /* onClick={findRoute()} */><i className="fas fa-shoe-prints fa-2x"></i>Go!</button>
        </nav>
      </header>
    );
  }
}

export default SearchHeader;