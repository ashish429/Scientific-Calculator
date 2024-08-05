const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const port = 3001; // Use port 3001 for your Express server

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ashish@123",
  database: "calculator_db",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Endpoint to save a calculation
app.post("/api/save", (req, res) => {
  const { expression, result } = req.body;
  const query = "INSERT INTO calculations (expression, result) VALUES (?, ?)";
  connection.query(query, [expression, result], (err, results) => {
    if (err) {
      console.error("Error saving calculation:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Calculation saved successfully" });
  });
});

// Endpoint to fetch the calculation history
app.get("/api/history", (req, res) => {
  const query = "SELECT * FROM calculations ORDER BY created_at DESC LIMIT 50";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching history:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
