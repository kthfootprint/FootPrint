import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faQuestionCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

import "../styles/comparison.scss";

export class Comparison extends Component {
  render() {
    return (
      <div className="comparable">
        <FontAwesomeIcon icon={faCar} />
        <p className="comparableNumber">
          {" "}
          {Math.round(this.props.comparableNumber)} g CO2
        </p>
        <FontAwesomeIcon
          icon={faQuestionCircle}
          data-tip
          data-for="tooltipparuuu"
        />
        <ReactTooltip
          id="tooltipparuuu"
          place="left"
          type="dark"
          effect="float"
          className="tooltipWrapper"
        >
          <FontAwesomeIcon icon={faTimesCircle} />
          <br />
          <span>
            This would be the emissions <br /> of driving a modern <br />{" "}
            diesel/petrol/hybrid car the same <br /> distance as your route.
            <br />
            <br />
            For more information about how <br /> this has been calculated,
            <br /> press HERE.
          </span>
        </ReactTooltip>
      </div>
    );
  }
}

export default Comparison;
