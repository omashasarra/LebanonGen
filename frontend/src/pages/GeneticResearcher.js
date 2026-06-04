import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

function GeneticResearcher() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("drEmail") === null) navigate("/drlog");
  }, [navigate]);
  const [regionStats, setRegionStats] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Get user info from localStorage
    const email = localStorage.getItem("drEmail");
    const role = localStorage.getItem("drRole");
    setUserEmail(email);
    setUserRole(role);

    // Fetch region statistics from new API endpoint
    const fetchData = async () => {
      try {
        const [regionRes, overallRes] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/admin/genetic-region-stats`,
          ),
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/admin/genetic-overall-stats`,
          ),
        ]);

        console.log("Region stats:", regionRes.data);
        console.log("Overall stats:", overallRes.data);

        setRegionStats(regionRes.data);
        setOverallStats(overallRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching genetic data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals from overallStats
  const totalRegions = regionStats.filter(
    (r) => r.total_individuals > 0,
  ).length;
  const totalCarriers = overallStats?.total_carriers || 0;
  const totalInfected = overallStats?.total_infected || 0;
  const totalNormal = overallStats?.total_normal || 0;
  const totalIndividuals = overallStats?.total_individuals || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading regional genetic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Regional Genetic Mapping"
        subtitle="Distribution of AA (Normal), AS (Carriers), and SS (Infected) by region"
        userEmail={userEmail}
        userRole={userRole}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm uppercase font-bold">
                  Total Regions
                </p>
                <p className="text-4xl font-bold mt-2">{totalRegions}</p>
                <p className="text-gray-100 text-xs mt-1">Geographic areas</p>
              </div>
              <div className="text-4xl">🗺️</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm uppercase font-bold">
                  Normal (AA)
                </p>
                <p className="text-4xl font-bold mt-2">{totalNormal}</p>
                <p className="text-green-100 text-xs mt-1">No genetic issues</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm uppercase font-bold">
                  Carriers (AS)
                </p>
                <p className="text-4xl font-bold mt-2">{totalCarriers}</p>
                <p className="text-yellow-100 text-xs mt-1">
                  Sickle cell trait
                </p>
              </div>
              <div className="text-4xl">🧬</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm uppercase font-bold">
                  Infected (SS)
                </p>
                <p className="text-4xl font-bold mt-2">{totalInfected}</p>
                <p className="text-red-100 text-xs mt-1">Sickle cell disease</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm uppercase font-bold">
                  Total Individuals
                </p>
                <p className="text-4xl font-bold mt-2">{totalIndividuals}</p>
                <p className="text-purple-100 text-xs mt-1">
                  All tested people
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionStats.map((region) => {
            const hasData = region.total_individuals > 0;

            return (
              <div
                key={region.RegionID}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div
                  className={`px-6 py-4 ${
                    region.risk_level === "HIGH RISK"
                      ? "bg-red-500"
                      : region.risk_level === "MODERATE RISK"
                        ? "bg-orange-500"
                        : region.risk_level === "ELEVATED RISK"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white">
                    {region.Name}
                  </h3>
                  <p className="text-white text-opacity-90 text-sm mt-1">
                    Total: {region.total_individuals} individuals
                  </p>
                  {hasData && (
                    <span className="inline-block mt-2 px-2 py-1 bg-white bg-opacity-20 rounded text-xs text-white">
                      {region.risk_level}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  {/* Normal (AA) */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Normal (AA)
                        </span>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        {region.normal || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${region.normal_percentage || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {region.normal_percentage || 0}% of individuals
                    </p>
                  </div>

                  {/* Carriers (AS) */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Carriers (AS)
                        </span>
                      </div>
                      <span className="text-xl font-bold text-yellow-600">
                        {region.carriers || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${region.carrier_percentage || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {region.carrier_percentage || 0}% of individuals
                    </p>
                  </div>

                  {/* Infected (SS) */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Infected (SS)
                        </span>
                      </div>
                      <span className="text-xl font-bold text-red-600">
                        {region.infected || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${region.infected_percentage || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {region.infected_percentage || 0}% of individuals
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {regionStats.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No regional data available.</p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            📊 Genetic Status Legend:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2 mt-0.5"></div>
              <div>
                <span className="font-medium text-gray-800">AA (Normal)</span>
                <p className="text-xs text-gray-500">
                  No sickle cell trait or disease
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2 mt-0.5"></div>
              <div>
                <span className="font-medium text-gray-800">AS (Carrier)</span>
                <p className="text-xs text-gray-500">
                  Sickle cell trait - usually asymptomatic
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2 mt-0.5"></div>
              <div>
                <span className="font-medium text-gray-800">SS (Infected)</span>
                <p className="text-xs text-gray-500">
                  Sickle cell disease - requires medical care
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneticResearcher;
