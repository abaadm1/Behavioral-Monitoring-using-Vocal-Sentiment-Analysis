import { Link } from "react-router-dom";
import "./profile.css";
import { useHistory } from "react-router-dom";
import ned from "./assets/ned.png";
function Welcome() {
  const history = useHistory();

  return (
    <div className="center">
      <div className="profile">
        <Link to="/">
          <img alt="homepage" src={ned} width="140px" />
        </Link>
        <h1>Welcome</h1>
        <div className="buttons">
          <button className="dummy" onClick={() => history.push("/upload")}>
            Upload Audio
          </button>
          <button className="dummy" onClick={() => history.push("/record")}>
            Record Audio
          </button>
          <button className="dummy" onClick={() => history.push("/profile")}>
            Supervisor's View
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
