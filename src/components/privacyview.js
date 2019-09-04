import React from "react";
import { Link } from "react-router-dom";

const PrivacyView = () => {
  const privacyDisclaimer =
    "Excepteur deserunt est magna aute aute duis. Excepteur reprehenderit magna et anim commodo ad cillum anim eiusmod. Magna et id enim incididunt ex elit commodo tempor voluptate fugiat nostrud commodo. Dolore mollit duis ea laboris culpa anim eiusmod exercitation deserunt ea voluptate amet. Irure aute elit do non sunt elit magna est in est esse aliquip. Nisi sunt sunt fugiat cupidatat reprehenderit enim nisi consequat aliquip deserunt occaecat. Qui consectetur laborum sit voluptate consectetur consectetur eu duis culpa adipisicing sunt reprehenderit commodo. Reprehenderit ad adipisicing nulla dolore id duis adipisicing elit cillum anim reprehenderit sunt. Sit ad amet commodo proident nisi enim in incididunt. Commodo consectetur laborum laborum id aliqua irure et esse minim qui ad ea laboris mollit. Non veniam cupidatat cupidatat excepteur ullamco eiusmod.";

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
        Contact: <a href="mailto:tjo@gmail.com">tjo@gmail.com</a>
      </div>
    </div>
  );
};

export default PrivacyView;
