const handleRoute = (result, inList, orig, dest) => {
  let routeList = inList;
  for (var r in result.routes) {
    var transitInfo = [];
    var typeTime = [];
    for (var t in result.routes[r].legs[0].steps) {
      var step = result.routes[r].legs[0].steps[t];
      if (step.transit_details) {
        let line = step.transit_details.line.short_name;
        if (!line) {
          line = step.transit_details.line.name;
          line = line.replace(/\D/g, "");
        }

        let color = step.transit_details.line.color;
        if (!color) {
          if (step.transit_details.line.vehicle.type === "BUS") {
            if (step.transit_details.line.short_name) {
              let blueBusses = [
                "1",
                "2",
                "3",
                "4",
                "6",
                "94",
                "172",
                "173",
                "176",
                "177",
                "178",
                "179",
                "471",
                "474",
                "670",
                "676",
                "677",
                "873",
                "875"
              ];
              if (blueBusses.includes(step.transit_details.line.short_name))
                color = "#0089ca";
              else color = "#d71d24";
            }
          }

          if (step.transit_details.line.vehicle.type === "TRAM") {
            if (step.transit_details.line.name) {
              if (
                step.transit_details.line.name
                  .toLowerCase()
                  .includes("tvärbanan")
              )
                color = "#d77d00";
              else if (
                step.transit_details.line.name
                  .toLowerCase()
                  .includes("nockebybanan")
              )
                color = "#778da7";
            } else if (step.transit_details.line.short_name) {
              if (step.transit_details.line.short_name === "7")
                color = "#878a83";
            }
          }

          if (step.transit_details.line.vehicle.type === "HEAVY_RAIL") {
            if (step.transit_details.line.name) {
              if (
                step.transit_details.line.name
                  .toLowerCase()
                  .includes("saltsjöbanan")
              )
                color = "#008f93";
              else if (
                step.transit_details.line.name
                  .toLowerCase()
                  .includes("roslagsbanan")
              )
                color = "#9f599a";
              else if (
                step.transit_details.line.name
                  .toLowerCase()
                  .includes("pendeltåg")
              )
                color = "#ec619f";
            }
          }
        }

        transitInfo.push({
          type: step.transit_details.line.vehicle.type,
          from: step.transit_details.departure_stop,
          to: step.transit_details.arrival_stop,
          line: line,
          lineColor: color,
          distance: step.distance
        });
      } else {
        var from, to;
        if (transitInfo.length < 1) {
          from = orig;
          to =
            result.routes[r].legs[0].steps[parseInt(t) + 1].transit_details
              .departure_stop;
        } else {
          from =
            result.routes[r].legs[0].steps[parseInt(t) - 1].transit_details
              .arrival_stop;
          to = dest;
        }
        transitInfo.push({
          type: step.travel_mode,
          from: from,
          to: to,
          line: null,
          lineColor: "#000000",
          distance: step.distance
        });
      }
      typeTime.push(step.duration.value);
    }
    var depart = result.routes[r].legs[0].departure_time
      ? result.routes[r].legs[0].departure_time.text
      : "";
    var arrive = result.routes[r].legs[0].arrival_time
      ? result.routes[r].legs[0].arrival_time.text
      : "";
    var totalTimeStr = result.routes[r].legs[0].duration.text;
    var route = {
      departure: depart,
      arrival: arrive,
      duration: totalTimeStr,
      typeLength: typeTime,
      transitInfo: transitInfo,
      index: r
    };
    routeList.push(route);
  }
  return routeList;
};

export default handleRoute;
