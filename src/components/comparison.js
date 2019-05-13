import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';

export class Comparison extends Component {
    render() {
        return (
          <div className="comparable">
            <FontAwesomeIcon icon={faCar} />
              <p>  {Math.round(this.props.comparableNumber * 100) / 100} g CO2</p>
            <FontAwesomeIcon icon={faQuestionCircle} data-tip data-for="tooltipparuuu"/>
            <ReactTooltip id='tooltipparuuu' place="top" type="dark" effect="solid">
              <span>Fin förklaring</span>
            </ReactTooltip>
          </div>
        );
    }
}

export default Comparison;
