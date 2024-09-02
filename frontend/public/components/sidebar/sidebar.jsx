import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./sidebar.scss";
import dashbord_icon from "./assets/Dashboard Icon.png";
import profile_icon from "./assets/Ball 28.png";
import interview_icon from "./assets/My class.png";

function Navbar() {
  return (
    <>
      <div className="sidebar">
        <div className="icons">
        <Link to="/dashbord">
          {" "}
          <img src={dashbord_icon} alt="dashbord" />
        </Link>
        <Link to="/dashbord">
          {" "}
          <img src={profile_icon} alt="dashbord" />
        </Link>
        <Link to="/dashbord">
          {" "}
          <img src={interview_icon} alt="dashbord" />
        </Link>
        <Link to="/dashbord">
          {" "}
          <img src={dashbord_icon} alt="dashbord" />
        </Link>
        </div>
        
      </div>
    </>
  );
}
export default Navbar;
