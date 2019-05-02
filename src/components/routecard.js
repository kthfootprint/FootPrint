import React from 'react';

var icon = {
    "WALKING": <i className="fas fa-walking"></i>,
    "BUS": <i className="fas fa-bus"></i>,
    "SUBWAY": <i className="fas fa-subway"></i>,
    "TRAIN": <i className="fas fa-train"></i>,
    "TRAM": <i className="fas fa-bus-alt"></i>,
    "FERRY": <i className="fas fa-ship"></i>
};

var card = [];

function RouteCard(props) {
    var list = props.list;
    for (var i in list) {
        var travelSteps = [];
        for (var t in list[i].type) {
            if (t > 0) {
                //travelSteps += '<i className="fas fa-chevron-right fa-xs"></i>' + icon[list[i].type[t]] + '<p><sub>' + Math.round(list[i].typeLength[t] / 60) + '</sub></p>';
                travelSteps.push(<div><i className="fas fa-chevron-right fa-xs"></i>{icon[list[i].type[t]]}<p><sub>{Math.round(list[i].typeLength[t] / 60)}</sub></p></div>);
            } else {
                //travelSteps += icon[list[i].type[t]] + '<p><sub>' + Math.round(list[i].typeLength[t] / 60) + '</sub></p>';
                travelSteps.push(<div>{icon[list[i].type[t]]}<p><sub>{Math.round(list[i].typeLength[t] / 60)}</sub></p></div>);
            }
        }
        //card += '<article className="card"><div className="top"><div className="travel">' + travelSteps + '</div><div className="emission"><p>100 CO2</p></div><div className="time"><p>' + list[i].duration + '</p></div></div><div className="bottom"><p>' + list[i].departure + ' - ' + list[i].arrival + '</p></div></article>';
        card.push(<article key={i} className="card"><div className="top"><div className="travel">{travelSteps}</div><div className="emission"><p>100 CO2</p></div><div className="time"><p>{list[i].duration}</p></div></div><div className="bottom"><p>{list[i].departure} - {list[i].arrival}</p></div></article>);
        console.log(card);
    }
    return (
        card
    );
}

export default RouteCard;
