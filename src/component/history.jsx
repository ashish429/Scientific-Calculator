import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await axios.get("/api/history");
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="history">
      <h2>Calculation History</h2>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            {item.expression} = {item.result} (on{" "}
            {new Date(item.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
