import React from "react";
import "./Switch.css";

const Switch = ({ isOn, handleToggle, index }) => {
  return (
    <div className="switch">
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new-${index}`}
        type="checkbox"
      />
      <label className="react-switch-label" htmlFor={`react-switch-new-${index}`}>
        <span className={`react-switch-button ${index}`} />
      </label>
    </div>
  );
};

export default Switch;
