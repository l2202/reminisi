import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

export default function GameHeader({ title }) {
  const navigate = useNavigate();

  return (
    <div className="navigate-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faLeftLong} />
      </button>

      <h1>{title}</h1>
    </div>
  );
}
