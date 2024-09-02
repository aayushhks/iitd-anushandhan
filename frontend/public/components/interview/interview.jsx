import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../sidebar/sidebar.jsx";
import Navbar from "../navbar/navbar.jsx";
import Upload from "../upload/upload.jsx";
import Webcam from "../webcam/webcam.jsx";
import "./interview.scss";
import { set } from "rsuite/esm/utils/dateUtils.js";

function Interview() {
 

  return (
    <>
      <div className="full-screen">
        <SideBar />
        <div className="content">
          <Navbar />
          <div className="interview">
            <div className="recording-container">
              <div className="recorder">
                <Webcam/>
              </div>
            </div>
            <div className="user-function">
              <Upload />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Interview;
