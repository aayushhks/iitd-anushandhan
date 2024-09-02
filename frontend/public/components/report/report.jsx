import React, { useState } from "react";
import SideBar from "../sidebar/sidebar.jsx";
import Navbar from "../navbar/navbar.jsx";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Import axios
import "./report.scss";
import { set } from "rsuite/esm/utils/dateUtils.js";

function Report() {
  const location = useLocation();
  const myObject = location.state;
  const [text, setText] = useState(false);
  console.log(myObject);
  var btntext="Get Full Text";
  if (text) {
    btntext="Get Video Text Summary";
  }
  const [semantic, setSemantic] = useState("");
  const [semanticValue, setSemanticValue] = useState("");
  const getText = () => {
    setText((prevState) => !prevState);
  };
  // Define handleSemantic function
  const handleSemantic = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      var words = semanticValue + " " + myObject.textsumm.summary;
      console.log(words);
      formData.append("text", words); // Append the entered word to FormData
      const response = await axios.post(
        "http://127.0.0.1:5091/semantic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSemantic(response.data.graph_url);
      console.log(semantic);
    } catch (error) {
      console.error("Error uploading semantics:", error);
    }
  };

  return (
    <>
      <div className="reportScreen">
        <SideBar />
        <div className="reportContent">
          <Navbar />

          <div className="report-summary">
            {text ? (
              <div>
                <h2>Full Text</h2>
                <p>
                  {myObject.textsummery
                    ? myObject.textsummery.word_frequencies
                    : ""}
                </p>
              </div>
            ) : (
              <div>
                <h2>Video Text Summary</h2>
                <p>{myObject.textsumm ? myObject.textsumm.summary : ""}</p>
              </div>
            )}

            <button className="btn-intermediate" onClick={getText}>
              {btntext}
            </button>
            <div className="semantics">
              <h3>Semantics</h3>
              <form onSubmit={handleSemantic}>
                <label>
                  Enter the word you want to do Semantics for:
                  <input
                    type="text"
                    name="name"
                    value={semanticValue}
                    onChange={(e) => setSemanticValue(e.target.value)}
                  />
                </label>
                <input type="submit" value="Submit" />
              </form>
            </div>
          </div>

          {semantic ? (
            <div className="report-img" id="semanticId">
              <div className="grid-img" id="gridID">
                <h2>Semantic</h2>
                <img src={semantic} alt="Positive WordCloud" />
              </div>{" "}
            </div>
          ) : (
            ""
          )}

          <div className="report-img">
            <div className="grid-img">
              <h2>Positive WordCloud</h2>
              <img
                src={myObject.wordCloudpos.graph_url}
                alt="Positive WordCloud"
              />
            </div>
            <div className="grid-img">
              <h2>Negative WordCloud</h2>
              <img
                src={myObject.wordCloudneg.graph_url}
                alt="Negative WordCloud"
              />
            </div>
          </div>
          <div className="report-img">
            <div className="grid-img">
              <h2>Positive BarPlot</h2>
              <img src={myObject.barplotpos.graph_url} alt="Positive BarPlot" />
            </div>
            <div className="grid-img">
              <h2>Negative BarPlot</h2>
              <img src={myObject.barplotneg.graph_url} alt="Negative BarPlot" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Report;
