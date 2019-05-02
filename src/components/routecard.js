import React from 'react';

const RouteCard = () => (
    <article class="card">
        <div class="top">
            <div class="travel">{travelSteps}</div>
            <div class="emission">
                <p>100 CO2</p>
            </div>
            <div class="time">
                <p>{list[i].duration}</p>
            </div>
        </div>
        <div class="bottom">
            <p>{list[i].departure} "-" {list[i].arrival}</p>
        </div>
    </article>
);

export default RouteCard;
