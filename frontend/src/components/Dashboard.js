import React, { useEffect, useState } from "react";
import axios from "axios";
import LebanonMap from "../components/LebanonMap";

function Dashboard() {
  const [cases, setCases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/map-region-stats`)
      .then((res) => {
        console.log("Backend Raw Response Data:", res.data);
        console.log("Is Array?", Array.isArray(res.data));
        const formatted = {};
        res.data.forEach((item) => {
          formatted[item.region] = {
            carriers: Number(item.carriers || 0),
            infected: Number(item.infected || 0),
            total: Number(item.carriers || 0) + Number(item.infected || 0),
          };
        });

        setCases(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard Fetch Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 font-medium text-sm">
          Synchronizing live GIS map modules...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl border border-red-200 max-w-md w-full">
          <h1 className="text-lg font-bold text-red-700 mb-2">
            Map Interface Offline
          </h1>
          <p className="text-gray-600 text-xs mb-4">Details: {error}</p>
          <p className="text-[11px] text-gray-400">
            Please confirm your Express server is operating normally.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-slate-900">
      {/* 🧭 Floating Glassmorphic Info Card (Top Right) */}
      <div className="absolute top-4 right-4 z-[1001] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200/80 max-w-sm pointer-events-auto">
        <h1 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
          📊 Website Test Diagnostics
        </h1>
        <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
          This interactive map dashboard displays real-time statistical
          distributions based strictly on genetic screening tests taken directly
          on this website.
        </p>
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <span>Server Link: Connected</span>
          <span className="text-emerald-500 animate-pulse">● Live Stream</span>
        </div>
      </div>

      {/* Full-bleed interactive canvas */}
      <LebanonMap cases={cases} />
    </div>
  );
}

export default Dashboard;
