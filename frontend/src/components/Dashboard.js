import React, { useEffect, useState } from "react";
import axios from "axios";
import LebanonMap from "../components/LebanonMap";

function Dashboard() {
  const [cases, setCases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/region-status-stats")  
      .then((res) => {
        console.log("API Response:", res.data);
        
        const formatted = {};
        
        res.data.forEach((item) => {
          const total = Number(item.carriers) + Number(item.infected);
          formatted[item.region] = total;
          console.log(`${item.region}: ${item.carriers} carriers + ${item.infected} infected = ${total}`);
        });
        
        setCases(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Genetic Cases by Region in Lebanon</h1>
        <p>Loading map data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Genetic Cases by Region in Lebanon</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Make sure backend server is running on port 5000</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Genetic Cases by Region in Lebanon</h1>
      
      {cases && Object.keys(cases).length > 0 ? (
        <LebanonMap cases={cases} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default Dashboard;