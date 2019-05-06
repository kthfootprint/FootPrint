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
        var html = [];
        for (var i in this.props.route.steps) {
            html.push(<div><i className={icon[this.props.route.steps[i].travel_mode]}/><p>{this.props.route.steps[i].html_instructions} ({this.props.route.steps[i].distance.value} m)</p><p>{this.props.route.departure_time.text}</p></div>);
        }
        return (
            <div id="directionDetails">
               {html}
            </div>
        );
    }
}
export default DirectionDetails;
