import React from "react";
import { Link } from "react-router-dom";

import "../styles/privacyview.scss";

const PrivacyView = () => {
  const privacyDisclaimer =
    "To be able to conduct our research, some data about your usage of this app is stored. This data will not be shared with anyone outside of the three of us who are working on this project. If you have any further concerns about this, please do not hesitate to contact us (see contact information at the bottom of this page).";
  return (
    <div className="privacyView">
      <div className="privacyTop">
        <Link to="/">
          <h4>Back</h4>
        </Link>
        <h3>Privacy Information</h3>
      </div>
      <div>{privacyDisclaimer}</div>
      <div>
        <h4>The following data is stored</h4>
        <ul>
          <li>What routes you searched for</li>
          <li>
            What routes you selected (and what other routes were available in
            that search)
          </li>
          <li>
            The user information you registered (email, age, gender, etc.)
          </li>
        </ul>
      </div>
      <div className="privacyBottom">
        <h4>
          <a href="mailto:edickson@kth.se">Contact us</a>
        </h4>
      </div>
    </div>
  );
};

export default PrivacyView;
