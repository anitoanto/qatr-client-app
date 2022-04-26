import { Link } from "react-router-dom";
import "./App.css"
function Nav() {
    return <div className="navb">
        <Link className="nav_link" to="/">Home</Link>
        <Link className="nav_link" to="/host">Host</Link>
        <Link className="nav_link" to="/client">Client</Link>
        <div className="nav_link" >Quick Audience Turnout Recorder - Group 11</div>
    </div>
}

export default Nav;