import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import axios from "axios";
import Logo from "./Marketing 7 Isometric Illustration - Agnytemp 1.png";
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const [email, setemailval] = useState("");
  const [password, setpassval] = useState("");
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const handlesubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5090/login", { email, password })
      .then((res) => {
        console.log(res);
        if (res.data.message === "Login successful!") {
          navigate("/");
        } else {
          alert("Invalid Credentials");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          alert("User not found! Please register.");
        } else if (err.response && err.response.status === 401) {
          alert("Invalid password!");
        } else {
          console.log("Error:", err);
        }
      });
  };

  return (
    <div className="login-page">
      <div className="head">
        <h1>Anusandhan</h1>
        <p>Product by nuroux</p>
      </div>
      <div className="login-container">
        <div className="login-img">
          <img src={Logo} alt="image" />
        </div>
        <div className="input">
          <div className="login-form">
            <h1>LOGIN FORM</h1>
            <div className="txt-line">
              <p>New to Anusandhan? </p>{" "}
              <Link to="/register" className="link-reg">
                <p> Register here..</p>
              </Link>
            </div>

            <form onSubmit={handlesubmit}>
              <label className="lab-font" for="emil1">
                Email address
              </label>
              <input
                placeholder=" enter your email...."
                type="email"
                name="mail"
                onChange={(e) => {
                  setemailval(e.target.value);
                }}
                id="emil1"
              />
              <label className="lab-font" for="pwd1">
                Password
              </label>
              <input
                placeholder=" enter your password...."
                type="password"
                name="password"
                onChange={(e) => {
                  setpassval(e.target.value);
                }}
                id="pwd1"
              />
              <button type="submit" id="sub_button" className="button-block">
                <span>Submit</span>
              </button>
            </form>
          </div>
          <button onClick={() => loginWithRedirect()} className="btn-intermediate">Login with Google</button>
        </div>
      </div>
    </div>
  );
}
export default Login;
