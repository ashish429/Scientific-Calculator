import React from "react";

const DisplayWindow = ({ expression, result }) => {
  return (
    <div className="display-window">
      <div className="expression">{expression}</div>
      <div className="result">{result}</div>
    </div>
  );
};

export default DisplayWindow;
