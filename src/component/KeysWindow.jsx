import React from "react";

const KeysWindow = ({ handleButton }) => {
  const buttons = [
    "AC",
    "DEL",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
    "sin",
    "cos",
    "tan",
    "ln",
    "log",
    "π",
    "e",
    "^",
    "√",
    "!",
    "(",
    ")",
    "mean",
    "median",
    "mode",
  ];

  return (
    <div className="keys-window">
      {buttons.map((button) => (
        <button key={button} onClick={() => handleButton(button)}>
          {button}
        </button>
      ))}
    </div>
  );
};

export default KeysWindow;
