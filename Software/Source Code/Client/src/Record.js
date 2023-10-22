import React from "react";
import "./profile.css";
import home from "./assets/home.png";
import { Link } from "react-router-dom";

const Record = () => {
  return (
    <div className="center">
      <div className="profile">
        <Link to="/">
          <img alt="homepage" src={home} width="50px" />
        </Link>
        <h1>Record Audio</h1>
      </div>
    </div>
  );
};

export default Record;
