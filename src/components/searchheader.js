import React, { Component } from 'react';
/* global google */

import * as icon from '../constants/icons';

class SearchHeader extends Component {
  constructor(props) {
    super(props)

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

  render() {
    return (
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
          {/* <button type="button" className="btn" onClick={() => this.findRoute()}><i className="fas fa-shoe-prints fa-2x"></i>Go!</button> */}
        </nav>
      </header>
    );
  }
}

export default SearchHeader;