var apiKey = config.API_KEY;

document.addEventListener("DOMContentLoaded", function() {
    autoFill();
  });

findRoute = () => {
    var orig = document.getElementById('origin-input').value;
    var dest = document.getElementById('destination-input').value;

    $(document).ready(function () {
        const Url = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + orig + "&destination=" + dest + "&mode=transit&alternatives=true&key=" + apiKey;
        $.ajax({
            url: Url,
            type: "GET",
            success: function (result) {
                console.log(result)
            },
            error: function (error) {
                console.log("Error", error)
            }
        })
    })
}

autoFill = () => {
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
  
    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    originAutocomplete.setFields(['address_components']);
  
    var destinationAutocomplete =
        new google.maps.places.Autocomplete(destinationInput);
    destinationAutocomplete.setFields(['address_components']);
}
