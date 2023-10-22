import { useState, useRef } from "react";
import "./profile.css";

// import { PieChart } from "./Components/PieChart";
import RecordMe from "./RecorderMe";
const Home = () => {
  const ref = useRef();
  const [audio, setAudio] = useState("");
  const [myData, setData] = useState({ file: null, filename: null });
  const [showData, setShowData] = useState([]);
  const [button, setButton] = useState(false);

  const [display, setDisplay] = useState(false);
  const [user, setUser] = useState(false);
  const [manager, setManager] = useState(false);
  const thandleUploadImage = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("filename", myData.filename);
    data.append("file", myData.file);
    console.log("test----->", myData.file);
    console.log("test----->", myData);
    // console.log("audio--->", audio);
    let endPoint = "http://127.0.0.1:8080";
    fetch(`${endPoint}/uploader`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify(data),
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        console.log(body);
      });
    });
    setButton(true);
  };
  const getAudio = (data) => {
    console.log("DATA--->", data);
    setAudio(data);
    console.log(audio);
    // const audioBlob = await fetch(audio).then((r) => r.blob());
    console.log("audio blob in home,");
    const url = URL.createObjectURL(data.blob);
    console.log(url);
    const blobData = new Blob(data.chunks, { type: "audio/wav; codecs=0" });
    var wavfromblob = new File([blobData], "test.wav");

    console.log(wavfromblob);
    setAudio(wavfromblob);

    // const audioFile = new File([audioBlob], "voice.wav", { type: "audio/wav" });
    // console.log("auudiio file in home -->", audioFile);
    // const formData = new FormData(); // preparing to send to the server
    // formData.append("file", audioFile); // preparing to send to the server
    // // onSaveAudio(formData); // sending to the server
    // console.log(formData);

    // --------- NEW CODE --------------
  };

  const pushAudio = (e) => {
    e.preventDefault();
    const newData = new FormData();
    newData.append("filename", null);
    newData.append("file", audio);
    fetch("http://127.0.0.1:8080/uploader", {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify(data),
      body: newData,
    }).then((response) => {
      response.json().then((body) => {
        console.log(body);
      });
    });
    setButton(true);
  };
  const showButton = (e) => {
    e.preventDefault();
    const result = fetch("http://127.0.0.1:8080/test")
      .then((response) => response.json())
      .then((responseData) => setShowData(responseData));
    console.log(result);
    setShowData(showData);
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
        <div>
          <div>
            <button
              onClick={() => {
                setUser(true);
                setManager(false);
              }}
            >
              Live Audio Recorder
            </button>
            <button
              onClick={() => {
                setManager(true);
                setUser(false);
              }}
            >
              Upload File
            </button>
          </div>
          {user && (
            <>
              <RecordMe getAudioFromRecorder={getAudio} />
              {/* <RecordView /> */}
              <button onClick={pushAudio}>Upload File</button>{" "}
            </>
          )}
          {manager && (
            <form onSubmit={thandleUploadImage}>
              <div>
                <input
                  type="file"
                  onChange={(e) =>
                    setData({ ...myData, file: e.target.files[0] })
                  }
                />
              </div>
              <div></div>
              <br />
              <div>
                <button>Upload File</button>
              </div>
            </form>
          )}
          {button && <button onClick={showButton}>Predict Emotions</button>}
          {/* {showData && showData.map((i, index) => <h1 key={index}>{i}</h1>)} */}
          {/* {showData && (
        <PieChart data={emotionsCount} totalEmotions={showData.length} />
      )} */}
        </div>
      </div>
    </div>
  );
};

export default Home;
