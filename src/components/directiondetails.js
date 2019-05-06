import React, { Component } from 'react';

export class DirectionDetails extends Component {

    componentDidMount() {
        console.log(this.props.route);
    }

    render() {
        var icon = {
            "WALKING": <i className="fas fa-walking"></i>,
            "BUS": <i className="fas fa-bus"></i>,
            "SUBWAY": <i className="fas fa-subway"></i>,
            "TRAIN": <i className="fas fa-train"></i>,
            "TRAM": <i className="fas fa-bus-alt"></i>,
            "FERRY": <i className="fas fa-ship"></i>
        };

        /* for (var i in this.props.route.steps) {

        } */
        return (
            <div id="directionDetails">
               <i className="fas fa-walking"></i>
               <p>Walk {this.props.route.steps[0].duration.text} ({this.props.route.steps[0].distance.value} m)</p>
               <p>{this.props.route.departure_time.text}</p>
            </div>
        );
    }
}
export default DirectionDetails;
