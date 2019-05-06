import React, { Component } from 'react';
import RouteMap from './routemap';
import DirectionDetails from './directiondetails';

export class DirectionOverlay extends Component {

    goBack = (e) => {
        //this.refs.overlay.style.height = "10vh";
        this.props.unmount();
    }

    render() {
        return (
            <div id="overlay" ref="overlay">
                <div className="map" style={{flex: 2}}>
                    <RouteMap route={this.props.route} />
                </div>
                <div id="backBtn" onClick={this.goBack}>
                    <i className="far fa-arrow-alt-circle-left fa-3x"></i>
                </div>
                <DirectionDetails route={this.props.route.legs[0]}/>
            </div>
        );
    }
}
export default DirectionOverlay;
