import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';

export class Comparison extends Component {
    render() {
        return (
          <div className="comparable">
            <FontAwesomeIcon icon={faCar} />
              <p>  {Math.round(this.props.comparableNumber)} g CO2</p>
            <FontAwesomeIcon icon={faQuestionCircle} data-tip data-for="tooltipparuuu"/>
            <ReactTooltip id='tooltipparuuu' place="left" type="dark" effect="solid">
              <span>This would be the emissions of driving a <br/> modern diesel/petrol/hybrid car the same<br/> distance as your route.</span>
            </ReactTooltip>
          </div>
        );
    }
}

export default Comparison;
