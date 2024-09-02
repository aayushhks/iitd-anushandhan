import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

import "./webcam.scss";
import { useNavigate } from "react-router-dom";
import { set } from "rsuite/esm/utils/dateUtils";

const VideoRecorder = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  var [textstring, setTextString] = useState("");
  const [button,setButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    const stream = webcamRef.current.video.srcObject;
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const mergedStream = new MediaStream([
      ...stream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    const mediaRecorder = new MediaRecorder(mergedStream);
    setMediaRecorder(mediaRecorder);

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
      }
    });

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      window.location.reload(); // Reload the website after download
    }, 1000);
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      recordedChunks.forEach((chunk) => {
        formData.append("file", chunk, "recording.webm");
      });

      const response = await axios.post(
        "http://127.0.0.1:9090/media/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const textstring = response.data.result;
      setTextString(textstring);
      console.log(textstring);
      // navigate(`/report/${textstring}`);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
    setLoading(false);
    setButton(true);
  };

  //handle-report
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
        "http://127.0.0.1:5090/text/summ",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData5 = resposne5.data;
      console.log(responseData5);
      // Navigate to another route with data from both APIs
      const myObject = {
        txt: textstring,
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
    <div className="webcam">
      <Webcam ref={webcamRef} className="cam" />
  { button? (<div className="btn-tool">
  <button className="btn-intermediate" onClick={handleReport}>
                Get Report
              </button>
  </div>) :(<div className="btn-tool">
        {isRecording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
        {recordedChunks.length > 0 && (
          <>
            <button onClick={downloadRecording} className="download-btn">
              Download Recording
            </button>
            {loading ? (
          <div className="loading">
            <p className="loading">Generating report...</p>
          </div>
        ) : (
          <button onClick={handleUpload} className="upload-btn">
          Upload Recording
        </button>
        )}
          </>
        )}
        

      </div>)}
    </div>
  );
};

export default VideoRecorder;
