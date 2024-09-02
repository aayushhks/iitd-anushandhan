import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./upload.scss";
import uploadgif from "./343cb53c87e313181d99248d3071bc-unscreen.gif";
import axios from "axios";
import image from "./noun-video-upload-939354 (1).png";
import reporticon from "./report.png";

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  var [textstring, setTextString] = useState("");
  const [showReportButton, setShowReportButton] = useState(false);
  const [reportImage, setReportImage] = useState(null);
  const [tagging, setTagging] = useState(true);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:9090/media/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      textstring = response.data.result;
      setTextString(textstring);
      console.log(textstring);
      setShowReportButton(true);
      setTagging(false);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
    setLoading(false);
  };

  const handleReport = async () => {
    try {
      // Make a POST request to the first API
      const formData = new FormData();
      formData.append("text", textstring);
      const response1 = await axios.post(
        "http://127.0.0.1:5090/wordcloud/pos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const reportImage1 = response1.data;
      console.log(reportImage1);

      // Make a POST request to the second API
      const response2 = await axios.post(
        "http://127.0.0.1:5090/wordcloud/neg",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData2 = response2.data;
      console.log(responseData2);

      //Make a Post request to the third API
      const resposne3 = await axios.post(
        "http://127.0.0.1:5090/barplot/high",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData3 = resposne3.data;
      console.log(responseData3);

      //Make a Post request to the fourth API
      const resposne4 = await axios.post(
        "http://127.0.0.1:5090/barplot/low",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData4 = resposne4.data;
      console.log(responseData4);
      //Make a Post request to the fourth API
      const resposne5 = await axios.post(
        "http://127.0.0.1:5090/text",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData5 = resposne5.data;
      console.log(responseData5);
        //Make a Post request to the fourth API
        const resposne6 = await axios.post(
          "http://127.0.0.1:5090/text/summ",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const responseData6 = resposne6.data;
        console.log(responseData6);
      // Navigate to another route with data from both APIs
      const myObject = {
        txt: textstring,
        textsummery: responseData6,
        wordCloudpos: reportImage1,
        wordCloudneg: responseData2,
        barplotpos: responseData3,
        barplotneg: responseData4,
        textsumm: responseData5,
      };
      navigate("/report", { state: myObject });
    } catch (error) {
      console.error("Error handling report:", error);
      setLoading(false);
    }
  };

  return (
    <div className="upload">
      <h1>Upload Video</h1>
      <div className="upload-video">
        {loading ? (
          <div className="loading">
            <img src={uploadgif} alt="" /> <p className="loading">Loading...</p>
          </div>
        ) : (
          <img src={image} alt="upload-image" />
        )}

        <input type="file" onChange={handleFileChange} />
        <div className="btn-upload">
          <button onClick={handleUpload} className="btn-intermediate">
            Upload Video
          </button>
        </div>
      </div>
      {tagging ? <h1>Tagging Section</h1> : <h1>Report Section</h1>}

      {tagging ? (
        <div className="upload-video">
          <div className="get-reportbtn">
            <button className="btn-intermediate">Get Tagging</button>
          </div>
        </div>
      ) : (
        <div className="upload-video">
          {showReportButton && (
            <div className="report-sec">
              <div className="report-ready">
                <p>Your Report is Ready</p> <img src={reporticon} alt="" />
              </div>
              <div className="get-reportbtn">
                <button className="btn-intermediate" onClick={handleReport}>
                  Get Report
                </button>
              </div>
            </div>
          )}

          {reportImage && (
            <div className="report-image">
              <img src={reportImage} alt="report" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
