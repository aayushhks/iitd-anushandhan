import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../login/Marketing 7 Isometric Illustration - Agnytemp 1.png";
import "./register.scss";

function Login() {

  const [email, setemailval] = useState("");
  const [uname, setuname] = useState("");
  const [password, setpassval] = useState("");
  const navigate =useNavigate();
  const handlesubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5090/register", {uname,email,password})
    .then((res)=>{
      console.log(res);
      alert("Registered Successfully continue with login now");
      navigate("/login");
    })
    .catch((err)=> console.log(err));
  };

    return (
      <>
      <div className="login-page">
        <div className="head" id="content">
          <h1>Anusandhan</h1>
          <p>Product by nuroux</p>
        </div>
        <div className="login-container">
          <div className="login-img">
            <img src={Logo} alt="image" />
          </div>
          <div className="input" id="register">
            <div className="login-form">
              <h1>REGISTER FORM</h1>
              <div className="txt-line">
                <p>Already a Member? </p>{" "}
                <Link to="/login" className="link-reg">
                  <p >     Login here..</p>
                </Link>
              </div>
  
              <form onSubmit={handlesubmit}>
              <label className="lab-font" for="emil1">
                  Username
                </label>
                <input
                  placeholder=" enter your useremail...."
                  type="name"
                  name="mail"
                  onChange={(e) => {
                    setuname(e.target.value);
                  }}
                  id="emil1"
                />

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
          </div>
        </div>
        </div>
      </>
    );
  }
export default Login;
  