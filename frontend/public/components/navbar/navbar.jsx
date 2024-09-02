import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "./Menu.png";
import userImg from "./Replace Image.png";
import "./navbar.scss";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth0();
  console.log(user);
  const userImg = user?.picture;
  const userName = user?.name;
  return (
    <>
      <div className="navbar">
        <div className="nav-head">
          <h1>Anusandhan</h1>
          <p>Product by nuroux</p>
        </div>
        <div className="search">
          <input type="text" placeholder="Search" />
          <img src={Logo} alt="menu logo" />
        </div>
        <div className="user-info">
          <img src={userImg} alt="user-img" />
          <h3>{userName} </h3>

          <button className="btn-intermediate" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
export default Navbar;
