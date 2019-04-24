var apiKey = config.API_KEY;

document.addEventListener("DOMContentLoaded", function () {
    autoFill();
});

findRoute = () => {
    var orig = document.getElementById('origin-input').value;
    var dest = document.getElementById('destination-input').value;
    var routeList = [];

    $(document).ready(function () {
        const Url = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + orig + "&destination=" + dest + "&mode=transit&alternatives=true&key=" + apiKey;
        $.ajax({
            url: Url,
            type: "GET",
            success: function (result) {
                console.log(result.routes[0]);
                for (r in result.routes) {
                    var tType = [];
                    var tTime = 0;
                    for (t in result.routes[r].legs[0].steps) {
                        var step = result.routes[r].legs[0].steps[t];
                        var info = "";
                        if (step.transit_details) {
                            tTime += step.duration.value;
                            info = step.transit_details.line.vehicle.type + " " + step.duration.text;
                        } else {
                            info = step.travel_mode + " " + step.duration.text;
                        }

                        tType.push(info);
                    }
                    var depart = result.routes[r].legs[0].departure_time.text;
                    var totalTime = result.routes[r].legs[0].duration.text;

                    var route = { departure: depart, duration: totalTime, type: tType, transitTime: tTime };
                    routeList.push(route);
                }
                routeList.sort(function(a, b) { 
                    return a.transitTime - b.transitTime;
                });
                drawRoute(routeList);
            },
            error: function (error) {
                console.log("Error", error)
            }
        })
    });
}

drawRoute = (list) => {
    document.getElementById('routes').innerHTML = "<tr><th>Type</th><th>Departure</th><th>Travel Time</th></tr>";
    for (i in list) {
        document.getElementById('routes').innerHTML +=
        "<tr><td>" + list[i].type + "</td><td>" + list[i].departure + "</td><td>" + list[i].duration + "</td></tr>";
    }
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
