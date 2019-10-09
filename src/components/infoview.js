import React from "react";
import { Link } from "react-router-dom";

import "../styles/infoview.scss";

const InfoView = () => {
  const infoText = [
    `Public transportation planning with carbon emissions!`,
    `You will get different options along with their carbon emissions. When you have found a suitable
    route, press the "Choose route" button to see further details.`
  ];

  const privacyText =
    "For information on what and how data is stored, please click ";

  return (
    <div className="infoView">
      <h2>Welcome to FootPrint!</h2>
      <p>{infoText[0]}</p>
      <p>{infoText[1]}</p>
      <p>
        {privacyText}{" "}
        <Link to="/privacy" tabIndex="-1">
          Here
        </Link>
      </p>
    </div>
  );
};

export default InfoView;
