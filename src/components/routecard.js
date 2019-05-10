import React, { Component } from 'react';
import DirectionOverlay from './directionoverlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faWalking, faBus, faBusAlt, faSubway, faTrain, faShip } from '@fortawesome/free-solid-svg-icons';

export class RouteCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route: [],
            overlay: false,
        };
    }

    calculateEmission = (transit) => {
        let emissionOut = 0;
        const eBus = 8 / 1000;
        const eSub = 0.16 / 1000;
        for (let i = 0; i < transit.length; i++) {
            let distance = transit[i].distance.value;
            if (transit[i].type === "BUS" || transit[i].type === "FERRY") {
                emissionOut += distance * eBus;
            } else if (transit[i].type === "SUBWAY" || transit[i].type === "TRAIN" || transit[i].type === "TRAM") {
                emissionOut += distance * eSub;
            }
        }
        return Math.round(emissionOut * 100) / 100;
    }

    selectCard = (e) => {
        var r = this.props.list[e.target.id].index;
        this.setState({ overlay: true, route: this.props.route[r] });
        /* selected.style.position = "fixed";
        selected.style.bottom = "0px";
        selected.style.zIndex = "10";
        selected.style.marginBottom = "0";
        console.log(e.target.id); */
    }

    removeOverlay = () => {
        this.setState({ overlay: false });
    }

    render() {
        var calculatedEmission = 0;
        var icon = {
            "WALKING": faWalking,
            "BUS": faBus,
            "SUBWAY": faSubway,
            "TRAIN": faTrain,
            "HEAVY_RAIL": faTrain,
            "TRAM": faBusAlt,
            "FERRY": faShip
        };
        var card = [];
        var list = this.props.list;
        for (var i in list) {
            calculatedEmission = this.calculateEmission(list[i].transitInfo);
            var travelSteps = [];
            for (let t = 0; t < list[i].transitInfo.length; t++) {
                if (t > 0) {
                    travelSteps.push(
                        <div key={t}>
                            <FontAwesomeIcon icon={faChevronRight}/>
                            {list[i].transitInfo[t].from.name && <p>{list[i].transitInfo[t].from.name}</p>}
                            <FontAwesomeIcon icon={icon[list[i].transitInfo[t].type]} style={{ color: list[i].transitInfo[t].lineColor }}/>
                            <p><sub>{list[i].transitInfo[t].line}</sub></p>
                        </div>
                    );
                } else {
                    travelSteps.push(
                        <div key={t}>
                            {list[i].transitInfo[t].from.name && <p>{list[i].transitInfo[t].from.name}</p>}
                            <FontAwesomeIcon icon={icon[list[i].transitInfo[t].type]} style={{ color: list[i].transitInfo[t].lineColor }}/>
                            <p><sub>{list[i].transitInfo[t].line}</sub></p>
                        </div>
                    );
                }
            }
            card.push(
                <article key={list[i].index} className="card" id={i} onClick={this.selectCard}>
                    <div className="top">
                        <div className="travel">
                            {travelSteps}
                        </div>
                        <div className="emission">
                            <p>{calculatedEmission} g CO2</p>
                        </div>
                        <div className="time">
                            <p>{list[i].duration}</p>
                        </div>
                    </div>
                    <div className="bottom">
                        {list[i].departure !== "" &&
                            <p>{list[i].departure} - {list[i].arrival}</p>
                        }
                    </div>
                </article>
            );
        }
        return (
            <div style={{ width: "100%" }}>
                {card}
                {this.state.overlay &&
                    <DirectionOverlay route={this.state.route} unmount={this.removeOverlay} />}
            </div>
        );
    }
}

export default RouteCard;
