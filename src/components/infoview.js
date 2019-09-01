import React from "react";
import { Link } from "react-router-dom";

const InfoView = () => {
  const infoText = [
    `This is a public transportation planning tool that calculates carbon emissions.
    To search for a trip, simply type your starting point and desired destination above and click the "Go!" button.`,
    `You will be presented with a number of options, along with their carbon emissions. As a comparison, the emission
    information for the same route, if instead travelling by car, is presented as well. When you have found a suitable
    route, press the "Choose route" button to see further details.`
  ];

  const privacyText =
    "For information on what and how data is stored, please click ";

  return (
    <div className="infoView">
      <h2>Welcome to FootPrint!</h2>
      <p>{infoText[0]}</p>
      <p>{infoText[1]}</p>
      {/* The a tag below will obviously go after routing has been implemented. Should link to privacy view. */}
      <p>
        {privacyText} <Link to="/privacy">Here</Link>
      </p>
    </div>
  );
};

export default InfoView;
