import React from "react";
import "./logo.css";
import logo from "./logo.png";

export default function Logo() {
  return (
    <div className="logo-container">
      <img src={logo} alt="logo" className="logo-img" />
    </div>
  );
}
