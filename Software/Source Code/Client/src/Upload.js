import React from "react";
import "./profile.css";
import home from "./assets/home.png";
import { Link } from "react-router-dom";

const Upload = () => {
  return (
    <div className="center">
      <div className="profile">
        <Link to="/">
          <img alt="homepage" src={home} width="50px" />
        </Link>
        <h1>Upload Audio</h1>
      </div>
    </div>
  );
};

export default Upload;
