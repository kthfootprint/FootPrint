import React, { Component } from 'react';
import RouteMap from './routemap';

export class DirectionOverlay extends Component {
    constructor(props) {
        super(props);
    }

    goBack = (e) => {
        //this.refs.overlay.style.height = "10vh";
        this.props.unmount();
    }

    render() {
        return (
            <div id="overlay" ref="overlay">
                <div className="map" style={{height: "100%", width: "100%"}}>
                    <RouteMap route={this.props.route} />
                </div>
                <div id="backBtn" onClick={this.goBack}>
                    <i className="far fa-arrow-alt-circle-left fa-3x"></i>
                </div>
            </div>
        );
    }
}
export default DirectionOverlay;
