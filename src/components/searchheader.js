import React from 'react';

class SearchHeader extends React.Component {

  render() {
/*     document.addEventListener("DOMContentLoaded", function () {
      autoFill();
      document.getElementById('origin-input').onclick = function () {
        if (this.value == "My location") {
          this.value = " ";
        }
      };
    });

    const autoFill = () => {
      var originInput = document.getElementById('origin-input');
      var destinationInput = document.getElementById('destination-input');

      var originAutocomplete = new google.maps.places.Autocomplete(originInput);
      originAutocomplete.setFields(['place_id']);

      var destinationAutocomplete =
        new google.maps.places.Autocomplete(destinationInput);
      destinationAutocomplete.setFields(['place_id']);
    } */

    return (
      <header>
        <nav id="searchField">
          <label class="inp">
            <input id="origin-input" class="controls" type="text" placeholder="&nbsp;" />
            <span class="label">Start</span>
            <span class="label" id="location"><i onClick="getLocation()" class="fas fa-crosshairs fa-lg"></i></span>
          </label>

          <label class="inp">
            <input id="destination-input" type="text" placeholder="&nbsp;" />
            <span class="label">Destination</span>
          </label>
        </nav>

        <nav id="goBtn">
          <button type="button" class="btn" onClick="findRoute()"><i class="fas fa-shoe-prints fa-2x"></i>Go!</button>
        </nav>
      </header>
    );
  }
}

export default SearchHeader;