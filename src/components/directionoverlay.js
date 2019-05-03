import React, { Component } from 'react';
import RouteMap from './routemap';

export class DirectionOverlay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="overlay">
                <div className="map">
                    <RouteMap route={this.props.route} />
                </div>
            </div>
        );
    }
}
export default DirectionOverlay;
