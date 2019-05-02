import React, { Component } from 'react';
import {Map, GoogleApiWrapper} from 'google-maps-react';

// https://www.npmjs.com/package/google-maps-react


export class RouteMap extends Component {

    render() {
        console.log(this.props.list);
        return (
            <Map google={this.props.google} zoom={14}></Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyC8nThaZKU2HvY_tKlPrEIeZRtlHpHWOy0')
})(RouteMap);