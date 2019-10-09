import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWalking, faBus, faSubway, faTrain, faBusAlt, faShip } from "@fortawesome/free-solid-svg-icons";

const icons = {
  WALKING: <FontAwesomeIcon icon={faWalking} />,
  BUS: <FontAwesomeIcon icon={faBus} />,
  SUBWAY: <FontAwesomeIcon icon={faSubway} />,
  TRAIN: <FontAwesomeIcon icon={faTrain} />,
  TRAM: <FontAwesomeIcon icon={faBusAlt} />,
  FERRY: <FontAwesomeIcon icon={faShip} />,
};

export default icons;
