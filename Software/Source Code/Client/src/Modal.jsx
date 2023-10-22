import "./profile.css";
import { useAuthValue } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth, database } from "./firebase";
import { useEffect, useState } from "react";

import { storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

import ReactAudioPlayer from "react-audio-player";
import { onValue, ref as databaseRef } from "firebase/database";
import Chart, { PieChart } from "./Chart";
import home from "./assets/home.png";
import { Link } from "react-router-dom";

function Upload() {
  const { currentUser } = useAuthValue();
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [data, setData] = useState([]);
  const [upload, setUpload] = useState(false);
  const [user, setUser] = useState("/agent-1");
  const [button, setButton] = useState(false);
  const [emoData, showemoData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [val, setVal] = useState("");
  const [showData, setShowData] = useState([]);
  const [myData, setmyData] = useState({ file: null, filename: null });
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  function handleChange(event) {
    setFile(event.target.files[0]);
    setmyData({ ...myData, file: event.target.files[0] });
  }

  const openModal = function () {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay2");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  const openFileModal = function () {
    const modal = document.querySelector(".fileModal");
    const overlay = document.querySelector(".overlay3");

    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  };

  const openUserModal = function () {
    const modal = document.querySelector(".userModal");
    const overlay = document.querySelector(".overlay");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  const openAnalyzeModal = function () {
    const modal = document.querySelector(".analyzeModal");
    const overlay = document.querySelector(".overlay4");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  const closeModal = function () {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay2");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  const closeUserModal = function () {
    const modal = document.querySelector(".userModal");
    const overlay = document.querySelector(".overlay");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  const closeFileModal = function () {
    const modal = document.querySelector(".fileModal");
    const overlay = document.querySelector(".overlay3");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  const closeAnalyzeModal = function () {
    const modal = document.querySelector(".analyzeModal");
    const overlay = document.querySelector(".overlay4");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  document.addEventListener("keydown", function (e) {
    const modal = document.querySelector(".modal");

    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
  const uploadFile = (e) => {
    e.preventDefault();
    setError1(false);
    setUpload(true);
    closeFileModal();
    // if (!file) {
    //   alert("Please choose a file first!");
    //   return;
    // }
    const data = new FormData();
    data.append("filename", myData.filename);
    data.append("file", myData.file);
    console.log("test----->", myData.file);
    console.log("test----->", myData);

    let file = myData.file;

    // let reader = new FileReader();

    // reader.readAsText(file);
    // reader.onload = function () {
    //   setVal(reader.result);
    // };
    const url = URL.createObjectURL(file);
    setVal(url);
    // console.log("audio--->", audio);
    let endPoint = "http://127.0.0.1:8080";
    fetch(`${endPoint}/uploader`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify(data),
      body: data,
    })
      .then((response) => {
        response.json().then((body) => {
          console.log(body);
          setError1(false);
          // setFile("");
        });
      })
      .catch((err) => {
        alert("Upload Failed: " + err.message);
        setError1(true);
        setFile("");
      });
  };
  const showButton = (e) => {
    // setError1(false)
    setLoader(true);
    e.preventDefault();
    const result = fetch("http://127.0.0.1:8080/test")
      .then((response) => response.json())
      .then((responseData) => {
        setShowData(responseData);
        setLoader(false);
        setUpload(false);
        setError1(false);
      })
      .catch((err) => {
        alert("Prediction Failed: " + err.message);
        setError2(false);
        closeAnalyzeModal();
      });
  };
  const statsData = () => {
    if (showData) {
      console.log(showData);
      var angry = 0;
      var normal = 0;
      for (let i = 0; i < showData.length; i++) {
        if (showData[i].includes("angry")) {
          angry = angry + 1;
        } else {
          normal = normal + 1;
        }
      }
    }
    return { angry, normal };
  };
  const emotionsCount = statsData();

  return (
    <div className="center">
      <div className="profile">
        <Link to="/">
          <img alt="homepage" src={home} width="50px" />
        </Link>
        <h1>Try as a user</h1>
        <br />

        {
          upload && file && !error1 && (
            <>
              {/* <span className="show-modal" onClick={openFileModal}>
              Upload Audio
            </span> */}
              <span>{file && <>Selected file: {file.name}</>}</span>
              <br />
              {!error1 && (
                <button
                  className="upload-file"
                  onClick={(e) => {
                    showButton(e);
                    openAnalyzeModal();
                  }}
                >
                  Predict Emotions
                </button>
              )}
            </>
          )
          // : <span></span>
          // error1 && (
          //   <span className="show-modal" onClick={openFileModal}>
          //     Upload Audio
          //   </span>

          // )
        }

        <span className="show-modal" onClick={openFileModal}>
          Upload Audio
        </span>
        {/* <span className="show-modal" onClick={openUserModal}>
          Live Audio Recorder
        </span> */}
      </div>

      {/* <div className="modal hidden">
        <div className="navbar">
          <h1>Audio Database</h1>
          <button className="uploader" onClick={openFileModal}>
            Upload
          </button>
        </div>
        <div className="body audio-body">
          <button
            className="dummy"
            onClick={() => {
              openAnalyzeModal();
            }}
            disabled={button}
          >
            Analyze
          </button>
        </div>
      </div> */}

      <div className="userModal hidden">
        <div className="navbar">
          <h1>Agents Database</h1>
        </div>
        <div className="body audio-body"></div>
      </div>

      <div className="fileModal hidden">
        <div className="navbar">
          <h1 style={{ marginBottom: "10px" }}>File Uploader</h1>
        </div>
        <div className="body">
          <form onSubmit={uploadFile}>
            <label>Select file:</label>
            <br />
            <input
              className="uploader"
              type="file"
              accept="audio/wav"
              onChange={handleChange}
            />
            <span>{file && <>Selected file: {file.name}</>}</span>
            <br />
            <button className="upload-file" disabled={percent > 0}>
              Upload file
            </button>
            {/* <br />
            {percent === 100 ? (
              <p className="loader-text">Upload complete</p>
            ) : percent > 0 ? (
              <p className="loader-text">{percent}% done</p>
            ) : null}
            <br /> */}
          </form>
        </div>
      </div>

      <div className="analyzeModal hidden">
        <div className="navbar">
          <h1 style={{ marginBottom: "10px" }}>Analyzer</h1>
        </div>
        <div className="body">
          {/* {loader2 ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            emoData.length === 0 &&
            !loader && (
              <button
                className="dummy"
                onClick={(e) => {
                  predictEmo(e);
                  // openAnalyzeModal();
                }}
              >
                Predict
              </button>
            )
          )} */}

          {loader && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}
          {!loader && showData.length != 0 && (
            <>
              {/* <Chart /> */}

              <div className="chart-container">
                <PieChart
                  data={emotionsCount}
                  totalEmotions={showData.length}
                />
              </div>

              <br />
              {val && (
                <ReactAudioPlayer
                  src={val}
                  controls
                  style={{ width: "100%", margin: "auto" }}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="overlay4 hidden" onClick={closeAnalyzeModal}></div>
      <div className="overlay3 hidden" onClick={closeFileModal}></div>
      <div className="overlay2 hidden" onClick={closeModal}></div>
      <div className="overlay hidden" onClick={closeUserModal}></div>
    </div>
  );
}

export default Upload;
