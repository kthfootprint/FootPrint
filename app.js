var apiKey = config.API_KEY;

document.addEventListener("DOMContentLoaded", function () {
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
                console.log(result.routes[0]);
                document.getElementById('routes').innerHTML = "<tr><th>Type</th><th>Departure</th><th>Travel Time</th></tr>";
                for (r in result.routes) {
                    var tType = [];
                    for (t in result.routes[r].legs[0].steps) {
                        var step = result.routes[r].legs[0].steps[t];
                        var info = "";
                        if (step.transit_details) {
                            info = step.transit_details.line.vehicle.type + " " + step.duration.text;
                        } else {
                            info = step.travel_mode + " " + step.duration.text;
                        }

                        tType.push(info);
                    }
                    var depart = result.routes[r].legs[0].departure_time.text;
                    var tTime = result.routes[r].legs[0].duration.text;
                    document.getElementById('routes').innerHTML +=
                        "<tr><td>" + tType + "</td><td>" + depart + "</td><td>" + tTime + "</td></tr>";
                }
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
