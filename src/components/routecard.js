import React, { Component } from 'react';
import DirectionOverlay from './directionoverlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faWalking, faBus, faBusAlt, faSubway, faTrain, faShip, faCar, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';

export class RouteCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route: [],
            overlay: false,
            emission: 0,
            comparable: 0,
            emissionColor: "rgb(0,200,0)"
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

    calculateComparable = (transit) => {
        let comparableOut = 0;
        const eCar = 101.7 / 1000;
        for (let i = 0; i < transit.length; i++) {
            let distance = transit[i].distance.value;
            comparableOut += distance * eCar;
        }
        return Math.round(comparableOut * 100) / 100;
    }

    getComparableObject = (comparableNumber) => {
        return(
            <div className="comparable">
                <FontAwesomeIcon icon={faCar} />
                <p>  {Math.round(comparableNumber * 100) / 100} g CO2</p>
                <FontAwesomeIcon icon={faQuestionCircle} />
            </div>
        );
    }

    emissionList = (emList) => {
        let unsortedEmissions = [];
        for (let i = 0; i < emList.length; i++) {
            unsortedEmissions.push(this.calculateEmission(emList[i].transitInfo));
        }
        return unsortedEmissions.sort();
    }

    emissionColor = (sortedEm, compare) => {
        let red = 0;
        let x = 0;
        if (sortedEm[0] !== sortedEm[sortedEm.length - 1]) {
            x = (compare - sortedEm[0]) / (sortedEm[sortedEm.length - 1] - sortedEm[0]);
            red = x*255;
        }
        return "rgb(" + red + ",200,0)"
    }

    getEmissionObject = (emission, color) => {
        return(
            <div className="emission">
                <p style={{ color: color }}>{emission} g CO2</p>
            </div>
        );
    }

    selectCard = (e) => {
        var r = this.props.list[e.target.id].index;
        let calculatedEmission = this.calculateEmission(this.props.list[e.target.id].transitInfo);
        let calculatedComparable = this.calculateComparable(this.props.list[e.target.id].transitInfo);
        let emissionColorValue = this.emissionColor(this.emissionList(this.props.list), calculatedEmission);
        this.setState({ 
            overlay: true,
            route: this.props.route[r],
            emission: calculatedEmission,
            comparable: calculatedComparable,
            emissionColor: emissionColorValue
        });
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
        var calculatedComparable = "";
        var emissionColorValue = 0;
        var emissionObject = "";
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
        var emissions = this.emissionList(list);
        for (var i in list) {
            calculatedEmission = this.calculateEmission(list[i].transitInfo);
            calculatedComparable = this.calculateComparable(list[i].transitInfo);
            emissionColorValue = this.emissionColor(emissions, calculatedEmission);
            emissionObject = this.getEmissionObject(calculatedEmission, emissionColorValue);
            var travelSteps = [];
            for (let t = 0; t < list[i].transitInfo.length; t++) {
                if (t > 0) {
                    travelSteps.push(
                        <div key={t}>
                            <FontAwesomeIcon icon={faChevronRight}/>
                            {list[i].transitInfo[t].from.name && <p>{list[i].transitInfo[t].from.name}</p>}
                            <br/>
                            <FontAwesomeIcon icon={icon[list[i].transitInfo[t].type]} style={{ color: list[i].transitInfo[t].lineColor }}/>
                            <p><sub>{list[i].transitInfo[t].line}</sub></p>
                        </div>
                    );
                } else {
                    travelSteps.push(
                        <div key={t}>
                            {list[i].transitInfo[t].from.name && <p>{list[i].transitInfo[t].from.name}</p>}
                            <br/>
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
                        <div className="rightCard">
                            <div className="time">
                                <p>{list[i].duration}</p>
                            </div>
                            {emissionObject}
                        </div>
                    </div>
                    <div className="bottom">
                        {list[i].departure !== "" &&
                            <p>{list[i].departure} - {list[i].arrival}</p>
                        }
                        {this.getComparableObject(calculatedComparable)}
                    </div>
                </article>
            );
        }
        return (
            <div style={{ width: "100%" }}>
                {card}
                {this.state.overlay &&
                    <DirectionOverlay
                        route={this.state.route}
                        emission={this.state.emission} 
                        comparable={this.state.comparable}
                        emissionColor={this.state.emissionColor}
                        unmount={this.removeOverlay}
                    />}
            </div>
        );
    }
}

export default RouteCard;
