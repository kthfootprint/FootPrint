import React, { Component } from 'react';
import RouteMap from './routemap';

export class DirectionOverlay extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var btn = document.getElementById("backBtn");
        btn.addEventListener("click", () => {
            this.props.unmount();
        })
    }

    render() {
        return (
            <div id="overlay">
                <div className="map">
                    <RouteMap route={this.props.route} />
                </div>
                <div id="backBtn">
                    <i className="far fa-arrow-alt-circle-left fa-3x"></i>
                </div>
            </div>
        );
    }
}
export default DirectionOverlay;
