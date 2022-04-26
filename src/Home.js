import { Link } from "react-router-dom";
import "./App.css";
import Nav from "./Nav";
function Home() {
  return (
    <div>
      <Nav />
      <div className="home_root">
        <div>
          <h1>Quick Audience Turnout Recorder</h1>
          <h3>Group 11</h3>
        </div>
        <h4>Join as</h4>
        <div>
          <Link to="/client">
            <button>client</button>
          </Link>
          {"  "}
          <Link to="/host">
            <button>host</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
