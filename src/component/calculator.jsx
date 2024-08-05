import React, { useEffect, useState } from "react";
import axios from "axios";
import DisplayWindow from "./DisplayWindow";
import KeysWindow from "./KeysWindow";
import History from "./history";
import "./calculator.css";

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [displayEXP, setDisplayEXP] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch the last 50 calculations from the server when the component mounts
    axios
      .get("http://localhost:3001/api/history")
      .then((response) => {
        setHistory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching history:", error);
      });
  }, []);

  const saveCalculation = (expression, result) => {
    axios
      .post("http://localhost:3001/api/save", { expression, result })
      .then(() => {
        // Fetch updated history after saving
        axios
          .get("http://localhost:3001/api/history")
          .then((response) => {
            setHistory(response.data);
          })
          .catch((error) => {
            console.error("Error fetching history:", error);
          });
      })
      .catch((error) => {
        console.error("Error saving calculation:", error);
      });
  };

  const sciFunc = {
    sin: "Math.sin",
    cos: "Math.cos",
    tan: "Math.tan",
    ln: "Math.log",
    log: "Math.log10",
    π: "Math.PI",
    e: "Math.E",
    "^": "**",
    "√": "Math.sqrt",
  };

  function calcResult() {
    if (expression.length !== 0) {
      try {
        let compute = new Function(`return ${expression}`)();
        compute = parseFloat(compute.toFixed(4));

        // Save the calculation to history in the database
        saveCalculation(displayEXP, compute);

        // Update the local history
        const calculation = `${displayEXP} = ${compute}`;
        setHistory((prevHistory) => [calculation, ...prevHistory.slice(0, 49)]);

        setResult(compute);
        setExpression(compute.toString());
        setDisplayEXP(compute.toString());
      } catch (error) {
        alert("An Error Occurred!");
        setResult("An Error Occurred!");
      }
    } else {
      alert("An Error Occurred!");
      setResult("An Error Occurred!");
    }
  }

  function handleButton(value) {
    if (value === "AC") {
      setExpression("");
      setDisplayEXP("");
      setResult("0");
    } else if (value === "DEL") {
      setDisplayEXP(displayEXP.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else if (sciFunc.hasOwnProperty(value)) {
      setDisplayEXP(displayEXP + value);
      setExpression(expression + sciFunc[value]);
    } else if (value === "!") {
      const lastNum = extractLastNum(expression);
      if (lastNum != null) {
        const num = parseFloat(lastNum);
        setDisplayEXP(displayEXP + value);
        setExpression(expression.replace(lastNum, factorial(num)));
      }
    } else if (value === "sin") {
      const firstNum = extractFirstNum(expression);
      if (firstNum != null) {
        const num = parseFloat(firstNum);
        setDisplayEXP(value + displayEXP);
        setExpression(expression.replace(firstNum, sin(num)));
      }
    } else if (value === "cos") {
      const firstNum = extractFirstNum(expression);
      if (firstNum != null) {
        const num = parseFloat(firstNum);
        setDisplayEXP(value + displayEXP);
        setExpression(expression.replace(firstNum, cos(num)));
      }
    } else if (value === "tan") {
      const firstNum = extractFirstNum(expression);
      if (firstNum != null) {
        const num = parseFloat(firstNum);
        setDisplayEXP(value + displayEXP);
        setExpression(expression.replace(firstNum, tan(num)));
      }
    } else if (value === "√") {
      const lastNum = extractLastNum(expression);
      if (lastNum != null) {
        const num = parseFloat(lastNum);
        const sqrtValue = Math.sqrt(num);
        const newExpression = expression.replace(lastNum, sqrtValue.toString());
        setDisplayEXP(displayEXP + "√(" + lastNum + ")");
        setExpression(newExpression);
        setResult(sqrtValue.toString());
      }
    } else if (value === "ln") {
      const firstNum = extractFirstNum(expression);
      if (firstNum != null) {
        const num = parseFloat(firstNum);
        setDisplayEXP(value + displayEXP);
        setExpression(expression.replace(firstNum, ln(num)));
      }
    } else if (value === "log") {
      const firstNum = extractFirstNum(expression);
      if (firstNum != null) {
        const num = parseFloat(firstNum);
        setDisplayEXP(value + displayEXP);
        setExpression(expression.replace(firstNum, log(num)));
      }
    } else if (value === "mean") {
      setDisplayEXP(value + displayEXP );
      setExpression(mean(displayEXP));
    } else if (value === "median") {
      setDisplayEXP("median(" + displayEXP + ")");
      setExpression(median(displayEXP));
    } else if (value === "mode") {
      setDisplayEXP("mode(" + displayEXP + ")");
      setExpression(mode(displayEXP));
    } else if (value === "=") calcResult();
    else {
      setExpression(expression + value);
      setDisplayEXP(displayEXP + value);
    }
  }

  function factorial(n) {
    let result = 1;
    for (let i = 1; i <= n; i++) result *= i;
    return result;
  }

  function mean(numbers) {
    if (numbers.length === 0) return 0;
    const total = numbers.reduce((acc, num) => acc + num, 0);
    return total / numbers.length;
  }

  function median(exp) {
    const numbers = exp.split(",").map((num) => parseFloat(num.trim()));
    if (numbers.length === 0) return 0;
    numbers.sort((a, b) => a - b);
    const len = numbers.length;
    const mid = Math.floor(len / 2);
    if (len % 2 === 0) {
      return (numbers[mid - 1] + numbers[mid]) / 2;
    } else {
      return numbers[mid];
    }
  }

  function mode(numbers) {
    if (numbers.length === 0) return "No Mode"; // Handle empty array
    const frequency = {};
    let maxFreq = 0;
    let modes = [];

    numbers.forEach((num) => {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
      }
    });

    for (const [num, freq] of Object.entries(frequency)) {
      if (freq === maxFreq) {
        modes.push(Number(num));
      }
    }

    return modes.length === numbers.length ? "No Mode" : modes.join(", ");
  }

  function sin(x) {
    return Math.sin(x);
  }

  function cos(x) {
    return Math.cos(x);
  }

  function tan(x) {
    return Math.tan(x);
  }

  function sqrt(x) {
    return Math.sqrt(x);
  }

  function log(x) {
    return Math.log10(x);
  }

  function ln(x) {
    return Math.log(x);
  }

  function extractLastNum(exp) {
    const numbers = exp.match(/\d+/g);
    return numbers ? numbers[numbers.length - 1] : null;
  }

  function extractFirstNum(exp) {
    const numbers = exp.match(/-?\d+(\.\d+)?/g);
    return numbers ? numbers[0] : null;
  }

  // Render the history list
  const renderHistory = () => {
    return history.map((entry, index) => <li key={index}>{entry}</li>);
  };

  return (
    <div className="calculator">
      <DisplayWindow expression={displayEXP} result={result} />
      <KeysWindow handleButton={handleButton} />
      <div className="history">
        <h3>Calculation History</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;
