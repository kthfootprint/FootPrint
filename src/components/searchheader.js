import React, { Component } from 'react';
import RouteCard from './routecard';
/* global google */

class SearchHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {routeList: []};
    this.orig = '';
    this.dest = '';
  }

  autoFill = () => {
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    originAutocomplete.setFields(['place_id']);

    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
    destinationAutocomplete.setFields(['place_id']);
  }

  // findRoute = (list) => {
  //   document.getElementById('main').innerHTML = "";
  //   for (var i in list) {
  //     var travelSteps = "";
  //     for (var t in list[i].type) {
  //       if (t > 0) {
  //         travelSteps += '<i className="fas fa-chevron-right fa-xs"></i>' + icon[list[i].type[t]] + '<p><sub>' + Math.round(list[i].typeLength[t] / 60) + '</sub></p>';
  //       } else {
  //         travelSteps += icon[list[i].type[t]] + '<p><sub>' + Math.round(list[i].typeLength[t] / 60) + '</sub></p>';
  //       }

  //     }
  //     document.getElementById('main').innerHTML += '<article className="card"><div className="top"><div className="travel">' + travelSteps + '</div><div className="emission"><p>100 CO2</p></div><div className="time"><p>' + list[i].duration + '</p></div></div><div className="bottom"><p>' + list[i].departure + ' - ' + list[i].arrival + '</p></div></article>';
  //   }
  // }

  abortGeolocation = (e) => {
    if (e.target.value === 'My location')
      e.target.value = '';
  }

  handleInput = (e, field) => {
    if (field === 'orig') this.orig = e.target.value;
    else if (field === 'dest') this.dest = e.target.value;
  }

  setPosition = (position) => {
    this.orig = position.coords.latitude + ', ' + position.coords.longitude;
  }

  getLocation = () => {
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');

    originInput.value = 'My location';
    destinationInput.value = '';
    destinationInput.select();

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
    var orig = "";
    
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
                //console.log(<RouteCard list={routeList}/>);
                this.setState({ routeList: routeList });
                //document.getElementById("main").innerHTML = <RouteCard list={routeList}/>;
        },
        (error) => {
          this.setState({
            isLoaded: true,
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
            <input id="origin-input" className="controls" type="text" placeholder='' onClick={(e) => this.abortGeolocation(e)} onChange={(e) => this.handleInput(e, 'orig')}/>
            <span className="label">Start</span>
            <span className="label" id="location"><i onClick={() => this.getLocation()} className="fas fa-crosshairs fa-lg"></i></span>
          </label>

          <label className="inp">
            <input id="destination-input" type="text" placeholder='' onChange={(e) => this.handleInput(e, 'dest')}/>
            <span className="label">Destination</span>
          </label>
        </nav>

        <nav id="goBtn">
          <button type="button" className="btn" onClick={() => this.findRoute()}><i className="fas fa-shoe-prints fa-2x"></i>Go!</button>
        </nav>
      </header>
      <div id="main"><RouteCard list={this.state.routeList}/></div>
      </div>
    );
  }
}

export default SearchHeader;