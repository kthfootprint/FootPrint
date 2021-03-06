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
  tooltip = React.createRef(null);

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
          ref={this.tooltip}
          place="top"
          type="dark"
          effect="float"
          className="tooltipWrapper"
          clickable
        >
          <FontAwesomeIcon
            icon={faTimesCircle}
            onClick={() => {
              const current = this.tooltip.current;
              current.tooltipRef = null;
              ReactTooltip.hide();
            }}
          />
          <br />
          <span>
            This would be the emissions <br /> of driving a modern <br /> petrol
            car the same <br /> distance as your route.
            <br />
            <br />
            <div id="linkToECV" onClick={() => this.props.toggleECV()}>
              Click here for more information about <br />
              how this has been calculated.
            </div>
          </span>
        </ReactTooltip>
      </div>
    );
  }
}

export default Comparison;
