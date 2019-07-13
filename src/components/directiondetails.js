import React, { Component } from 'react';
import Comparison from './comparison';
import styled from 'styled-components';

export class DirectionDetails extends Component {

    emissionBox = () => {
        return(
            <div className="emissionBox">
                <div className="emission" style={{color: this.props.emissionColor}}>
                    <p>Your trip emits: {this.props.emission} g CO2</p>
                </div>
                <Comparison comparableNumber={this.props.comparable} />
            </div>
        );
    }

    render() {
        const steps = this.props.route.steps;
        const icon = {
            "WALKING": <i className="fas fa-walking"></i>,
            "BUS": <i className="fas fa-bus"></i>,
            "SUBWAY": <i className="fas fa-subway"></i>,
            "TRAIN": <i className="fas fa-train"></i>,
            "TRAM": <i className="fas fa-bus-alt"></i>,
            "FERRY": <i className="fas fa-ship"></i>
        };
        let allSteps = [];
        for (var i in steps) {
            allSteps.push(
                <div key={"direction" + i}>
                    <div className="transitDetails">
                        <div className="stepDetailTime">
                            {icon[steps[i].transit_details ? steps[i].transit_details.line.vehicle.type : steps[i].travel_mode]}
                            {steps[i].transit_details ? steps[i].transit_details.departure_time.text : ""}
                        </div>
                    </div>
                    <p className="stepDetailInstructions">
                        {this.props.route.steps[i].html_instructions} ({this.props.route.steps[i].distance.value} m)
                    </p>
                </div>);
        }
        return (
            <div id="directionDetails">
                <DirectionSteps>
                    {allSteps}
                </DirectionSteps>
               <hr style={{ borderWidth: "1.5px", width: "100%"}}/>
               {this.emissionBox()}
            </div>
        );
    }
}

const DirectionSteps = styled.div`
    margin: 2px 10px 0 10px;
    overflow: scroll;
    padding: 0 2.5px 0 2.5px;
    font-size: 0.7em;
    div {
        margin: 0.5em;
    }
    .stepDetailTime {
        width: 15%;
        margin: 0em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #5E6960;
    }
`

export default DirectionDetails;
