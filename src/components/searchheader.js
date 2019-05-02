import React from 'react';
/* global google */

class SearchHeader extends React.Component {

  render() {
    var icon = {
      "WALKING": '<i className="fas fa-walking"></i>',
      "BUS": '<i className="fas fa-bus"></i>',
      "SUBWAY": '<i className="fas fa-subway"></i>',
      "TRAIN": '<i className="fas fa-train"></i>',
      "TRAM": '<i className="fas fa-bus-alt"></i>',
      "FERRY": '<i className="fas fa-ship"></i>'
    };
    var orig = "";

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
            <span className="label" id="location"><i onClick={getLocation()} className="fas fa-crosshairs fa-lg"></i></span>
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