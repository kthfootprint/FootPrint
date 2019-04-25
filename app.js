var apiKey = config.API_KEY;
var icon = {
    "WALKING": '<i class="fas fa-walking"></i>',
    "BUS": '<i class="fas fa-bus"></i>',
    "SUBWAY": '<i class="fas fa-subway"></i>',
    "TRAIN": '<i class="fas fa-train"></i>'
};

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
                    var typeTime = [];
                    var tTime = 0;
                    for (t in result.routes[r].legs[0].steps) {
                        var step = result.routes[r].legs[0].steps[t];
                        var info = "";
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
            error: function (error) {
                console.log("Error", error)
            }
        })
    });
}

drawRoute = (list) => {
    document.getElementById('main').innerHTML = "";
    for (i in list) {
        var travelSteps = "";
        for (t in list[i].type) {
            if (t > 0) {
                travelSteps += '<i class="fas fa-chevron-right fa-xs"></i>' + icon[list[i].type[t]] + '<p><sub>' + Math.round(list[i].typeLength[t] / 60) + '</sub></p>';
            } else {
                travelSteps += icon[list[i].type[t]] + '<p><sub>' + Math.round(list[i].typeLength[t] / 60) + '</sub></p>';
            }
            
        }
        document.getElementById('main').innerHTML += '<article class="card"><div class="top"><div class="travel">' + travelSteps + '</div><div class="emission"><p>100 CO2</p></div><div class="time"><p>' + list[i].duration + '</p></div></div><div class="bottom"><p>' + list[i].departure + ' - ' + list[i].arrival + '</p></div></article>';
    }
}

autoFill = () => {
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    originAutocomplete.setFields(['place_id']);

    var destinationAutocomplete =
        new google.maps.places.Autocomplete(destinationInput);
    destinationAutocomplete.setFields(['place_id']);
}
