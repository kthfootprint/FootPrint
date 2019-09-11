import React, { Component } from "react";
import { mapStyling, mapOptions } from "./RouteTools/googleUtils";
/* global google */

export class RouteMap extends Component {
  componentDidMount() {
    this.initMap();
  }

  initMap = () => {
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(this.props.route.bounds.northeast);
    bounds.extend(this.props.route.bounds.southwest);
    var styledMapType = new google.maps.StyledMapType(mapStyling, {
      name: "Styled Map"
    });
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");
    map.fitBounds(bounds);
    var path = "";
    path = google.maps.geometry.encoding.decodePath(
      this.props.route.overview_polyline.points
    );
    var directionsDisplayBorder = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: "black",
      strokeOpacity: 1.0,
      strokeWeight: 7
    });
    var directionsDisplay = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: this.props.emissionColor,
      strokeOpacity: 1.0,
      strokeWeight: 5
    });
    directionsDisplay.setMap(map);
    directionsDisplayBorder.setMap(map);
  };

  render() {
    return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
  }
}
export default RouteMap;
