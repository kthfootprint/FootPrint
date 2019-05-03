import React, { Component } from 'react';
import {Map, GoogleApiWrapper} from 'google-maps-react';
/* global google */

// https://www.npmjs.com/package/google-maps-react


export class RouteMap extends Component {
    constructor(props) {
        super(props);
      }

      componentDidMount() {
        this.initMap();
      }

      initMap = () => {
        var stockholm = new google.maps.LatLng(59.33258, 18.0649);
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(this.props.route.bounds.northeast);
        bounds.extend(this.props.route.bounds.southwest);
        var styledMapType = new google.maps.StyledMapType(
            [
                {
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#242f3e"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#746855"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#242f3e"
                    }
                  ]
                },
                {
                  "featureType": "administrative.land_parcel",
                  "elementType": "labels",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "administrative.locality",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#d59563"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "labels.text",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#d59563"
                    }
                  ]
                },
                {
                  "featureType": "poi.business",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#263c3f"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#6b9a76"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#38414e"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "geometry.stroke",
                  "stylers": [
                    {
                      "color": "#212a37"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "labels.icon",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9ca5b3"
                    }
                  ]
                },
                {
                  "featureType": "road.arterial",
                  "elementType": "labels",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#746855"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry.stroke",
                  "stylers": [
                    {
                      "color": "#1f2835"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "labels",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#f3d19c"
                    }
                  ]
                },
                {
                  "featureType": "road.local",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "road.local",
                  "elementType": "labels",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "transit",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "transit",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#2f3948"
                    }
                  ]
                },
                {
                  "featureType": "transit.station",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#d59563"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#17263c"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#515c6d"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#17263c"
                    }
                  ]
                }
              ],
        {name: 'Styled Map'});
        var mapOptions = {
          zoom:7,
          center: stockholm,
          mapTypeControl: false,
          zoomControl: false,
          scaleControl: false,
          streetViewControl: false,
          fullscreenControl: false
        }
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');
        map.fitBounds(bounds);
        var path = '';
        path = google.maps.geometry.encoding.decodePath(this.props.route.overview_polyline.points);
        var directionsDisplay = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#0F9D58',
            strokeOpacity: 1.0,
            strokeWeight: 5
          });
        directionsDisplay.setMap(map);
      }
    

    render() {
        /* console.log(this.props.list);
        return (
            <Map google={this.props.google} zoom={14}></Map>
        ); */

        return(
            <div id="map"></div>
        );
    }
}
export default RouteMap;

/* export default GoogleApiWrapper({
    apiKey: ('AIzaSyC8nThaZKU2HvY_tKlPrEIeZRtlHpHWOy0')
})(RouteMap); */