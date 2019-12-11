import React from "react";

import "../styles/emissioncalculationview.scss";

const EmissionCalculationView = props => {
  return (
    <div className="emissionCalculationView">
      <div className="emissionCalculationTop">
        <h4 onClick={() => props.toggleECV()}>Back</h4>
        <h3>Calculation of emissions</h3>
      </div>
      <div>
        The emission calculations performed in this web app are based on figures
        acquired through Region Stockholm (SLL), the organization that is
        responsible for public transportation in Stockholm. The number used is
        the amount of CO2 emitted by personkilometer (i.e. for one person
        travelling using that specific mode of transportation). Subway trains
        and commuter trains are assumed to have similar CO2 emissions for the
        purposes of this prototype. For the petrol cars, information about
        emissions were acquired through the European Environment Agency.
      </div>
      <div>
        For both public transportation and petrol cars, the emissions are
        calculated using a simple formula:
      </div>
      <div id="emissionFormula">
        For each different mode of transportation:
        <br />
        (mode-specific emission per meter) * (meters travelled) = emission
      </div>
      <div>
        It is important to note that this specific project does not claim to
        fully represent the environmental impact of travel, but is merely a way
        to convey carbon emission data. If you have any questions or criticism,
        please find a link to contact us below.
      </div>
      <div>
        <h4>Sources for data</h4>
        <ul>
          <li>
            <a href="https://www.sll.se/globalassets/2.-kollektivtrafik/fakta-om-sl-och-lanet/sl_och_lanet_2017.pdf">
              Report by Region Stockholm (SLL)
            </a>
          </li>
          <li>
            <a href="https://www.eea.europa.eu/highlights/average-co2-emissions-from-new">
              European Environment Agency
            </a>
          </li>
        </ul>
      </div>
      <div className="emissionCalculationBottom">
        <h4>
          <a href="mailto:edickson@kth.se">Contact us</a>
        </h4>
      </div>
    </div>
  );
};

export default EmissionCalculationView;
