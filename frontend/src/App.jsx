import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "../public/components/login/login.jsx";
import Interview from "../public/components/interview/interview.jsx";
import Register from "../public/components/register/register.jsx";
import Report from "../public/components/report/report.jsx";

function App() {

  return (
    <>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<Report />} />
          <Route path="/" element={<Interview />} />
        </Routes>
      </Router>
    </div>
    </>
  )
}

export default App
