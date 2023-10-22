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
// import Chart from "./Chart";
import home from "./assets/home.png";
import { Link } from "react-router-dom";

function Test() {
  const { currentUser } = useAuthValue();
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("/agent-1");

  const [loader, setLoader] = useState(false);

  function handleChange(event) {
    setFile(event.target.files[0]);
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
    if (!file) {
      alert("Please choose a file first!");
    } else {
      const _storageRef = storageRef(storage, `${user}/${file.name}`);
      const uploadTask = uploadBytesResumable(_storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setData((arr) => [...arr, { name: file.name, url }]);
            closeFileModal();
            setFile("");
            setPercent(0);
          });
        }
      );
    }
  };

  const analyze = async ({ name, url }) => {
    setLoader(true);
    console.log(name, url);
    // ... promise

    // TODO: to be placed in then block of promise
    setTimeout(() => {
      setLoader(false);
    }, 3000);
  };

  const listItem = (callURL) => {
    console.log(callURL);
    const storagestorageRef = storageRef(storage, `${callURL}/`);
    setUser(callURL);

    listAll(storagestorageRef)
      .then((res) => {
        res.items.forEach((itemstorageRef) => {
          getDownloadURL(itemstorageRef).then((url) =>
            setData((arr) => [...arr, { name: itemstorageRef.name, url }])
          );
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const listUsers = () => {
    const usersRef = databaseRef(database, "agents");
    onValue(
      usersRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          setUsers((arr) => [...arr, childData]);
        });
      },
      {
        onlyOnce: true,
      }
    );
  };

  useEffect(() => {
    listUsers();
  }, []);

  const deleteFromFirebase = (url) => {
    let audiostorageRef = storageRef(storage, url);
    deleteObject(audiostorageRef)
      .then(() => {
        setData((arr) => arr.filter((item) => item.url !== url));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const fetchAudios = (callURL) => {
    setData([]);
    // console.log(document.querySelector(""))
    setUser(callURL);
    openModal();
    listItem(callURL);
  };

  return (
    <div className="center">
      <div className="profile">
        <Link to="/">
          <img alt="homepage" src={home} width="50px" />
        </Link>
        <h1>Profile</h1>
        <p>
          <strong>Email: </strong>
          {currentUser?.email}
        </p>
        <p>
          <strong>Email verified: </strong>
          {`${currentUser?.emailVerified}`}
        </p>
        <br />
        <span className="show-modal" onClick={openUserModal}>
          Access Database
        </span>
        <span className="logout" onClick={() => signOut(auth)}>
          Sign Out
        </span>
      </div>

      <div className="modal hidden">
        <div className="navbar">
          <h1>Audio Database</h1>
          <button className="uploader" onClick={openFileModal}>
            Upload
          </button>
        </div>
        <div className="body audio-body">
          {users &&
            users
              .filter((_user) => _user.callURL === user)
              .map((_user) => (
                <div
                  key={_user.id}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <h3>
                    Agent: <b>{_user.name}</b> - AgentID: <b>{_user.id}</b>
                  </h3>
                </div>
              ))}
          {data.length > 0 ? (
            data.map(({ name, url, size }) => (
              <div key={url}>
                <h2>File: {name}</h2>
                <div className="row">
                  {url && (
                    <ReactAudioPlayer
                      src={url}
                      controls
                      style={{ width: "75%" }}
                    />
                  )}
                  <div className="buttons">
                    <button
                      className="delete"
                      onClick={() => deleteFromFirebase(url)}
                    >
                      Delete
                    </button>
                    <button
                      className="dummy"
                      onClick={() => {
                        openAnalyzeModal();
                        setFile({ name, url });
                        analyze({ name, url });
                      }}
                    >
                      Analyze
                    </button>
                  </div>

                  <br />
                </div>

                <div className="buttons-mob">
                  <button
                    className="delete"
                    onClick={() => deleteFromFirebase(url)}
                  >
                    Delete
                  </button>
                  <button className="dummy">Analyze</button>
                </div>
              </div>
            ))
          ) : (
            <>No audio files available</>
          )}
        </div>
      </div>

      <div className="userModal hidden">
        <div className="navbar">
          <h1>Agents Database</h1>
        </div>
        <div className="body audio-body">
          <h3 style={{ paddingLeft: "20px" }}>Available agents</h3>
          {users.length > 0 ? (
            users.map(({ name, id, callURL }) => (
              <div
                key={id}
                className="user-row"
                data-value={callURL}
                onClick={() => fetchAudios(callURL)}
              >
                <input value={callURL} className="hidden" />
                <div className="row">
                  <p>{name}</p>
                </div>
              </div>
            ))
          ) : (
            <>No agents available</>
          )}
          <br />
        </div>
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
            <br />
            {percent === 100 ? (
              <p className="loader-text">Upload complete</p>
            ) : percent > 0 ? (
              <p className="loader-text">{percent}% done</p>
            ) : null}
            <br />
          </form>
        </div>
      </div>

      <div className="analyzeModal hidden">
        <div className="navbar">
          <h1 style={{ marginBottom: "10px" }}>Analyzer</h1>
        </div>
        <div className="body">
          {loader ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {/* <Chart /> */}
              <br />
              {file && (
                <ReactAudioPlayer
                  src={file.url}
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

export default Test;
