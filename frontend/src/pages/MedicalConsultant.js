import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../components/DashboardHeader";

function MedicalConsultant() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [selectedCouple, setSelectedCouple] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Helper: Normalize probability to 0-1 range
  const normalizeProbability = (prob) => {
    if (prob === null || prob === undefined) return 0;
    if (prob >= 0 && prob <= 1) return prob;
    if (prob > 1 && prob <= 100) return prob / 100;
    if (prob > 100) return 1;
    return 0;
  };

  // Helper: Get risk level based on probability
  const getRiskLevel = (probability) => {
    const normalized = normalizeProbability(probability);
    if (normalized >= 0.75) return "CRITICAL";
    if (normalized >= 0.50) return "VERY HIGH RISK";
    if (normalized >= 0.25) return "HIGH RISK";
    if (normalized > 0) return "CARRIER RISK";
    return "LOW RISK";
  };

  // Helper: Get risk color class
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "bg-red-600 text-white";
      case "VERY HIGH RISK":
        return "bg-orange-700 text-white";
      case "HIGH RISK":
        return "bg-orange-500 text-white";
      case "CARRIER RISK":
        return "bg-yellow-400 text-yellow-900";
      default:
        return "bg-green-500 text-white";
    }
  };

  // Helper: Get progress bar color
  const getProgressColor = (probability) => {
    const normalized = normalizeProbability(probability);
    if (normalized >= 0.75) return "bg-red-600";
    if (normalized >= 0.50) return "bg-orange-700";
    if (normalized >= 0.25) return "bg-orange-500";
    if (normalized > 0) return "bg-yellow-400";
    return "bg-green-500";
  };

  // Handle View Report click
  const handleViewReport = async (email) => {
    setModalLoading(true);
    setShowModal(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/couple-details/${encodeURIComponent(email)}`);
      setSelectedCouple(response.data);
    } catch (error) {
      console.error("Error fetching couple details:", error);
      alert("Failed to load couple details");
    } finally {
      setModalLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCouple(null);
  };

  useEffect(() => {
    const email = localStorage.getItem("drEmail");
    const role = localStorage.getItem("drRole");
    setUserEmail(email);
    setUserRole(role);

    axios
      .get("http://localhost:5000/api/admin/assessments")
      .then((res) => {
        const normalizedData = res.data.map((item) => ({
          ...item,
          normalizedProbability: normalizeProbability(item.Probability),
          riskLevel: getRiskLevel(item.Probability),
        }));
        setData(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching assessments:", err);
        setLoading(false);
      });
  }, []);

  const totalCases = data.length;
  const criticalCases = data.filter(item => item.riskLevel === "CRITICAL").length;
  const veryHighRiskCases = data.filter(item => item.riskLevel === "VERY HIGH RISK").length;
  const highRiskCases = data.filter(item => item.riskLevel === "HIGH RISK").length;
  const carrierCases = data.filter(item => item.riskLevel === "CARRIER RISK").length;
  const lowRiskCases = data.filter(item => item.riskLevel === "LOW RISK").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Clinical Risk Review"
        subtitle="Review and manage high-risk genetic assessments"
        userEmail={userEmail}
        userRole={userRole}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-600">
            <p className="text-xs text-gray-500 uppercase font-bold">Critical</p>
            <p className="text-2xl font-bold text-red-600">{criticalCases}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-700">
            <p className="text-xs text-gray-500 uppercase font-bold">Very High Risk</p>
            <p className="text-2xl font-bold text-orange-700">{veryHighRiskCases}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
            <p className="text-xs text-gray-500 uppercase font-bold">High Risk</p>
            <p className="text-2xl font-bold text-orange-500">{highRiskCases}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-400">
            <p className="text-xs text-gray-500 uppercase font-bold">Carrier Risk</p>
            <p className="text-2xl font-bold text-yellow-600">{carrierCases}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-xs text-gray-500 uppercase font-bold">Low Risk</p>
            <p className="text-2xl font-bold text-green-600">{lowRiskCases}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
            <p className="text-xs text-gray-500 uppercase font-bold">Total Cases</p>
            <p className="text-2xl font-bold text-blue-600">{totalCases}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Couple Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Probability</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Recommendation</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center">Loading...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center">No assessments found.</td>
                  </tr>
                ) : (
                  data.map((item) => {
                    const percentValue = Math.round(item.normalizedProbability * 100);
                    return (
                      <tr key={item.AssessmentID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.Email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getRiskColor(item.riskLevel)}`}>
                            {item.riskLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="font-bold w-12">{percentValue}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full ${getProgressColor(item.normalizedProbability)}`} style={{ width: `${percentValue}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{item.Recommendation}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleViewReport(item.Email)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 text-sm font-medium"
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal}></div>
          
          {/* Modal Content */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Couple Genetic Report</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                {modalLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading couple data...</p>
                  </div>
                ) : selectedCouple ? (
                  <>
                    {/* Couple Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-gray-700 mb-2">Couple Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">Email:</span> {selectedCouple.email}</div>
                        <div><span className="text-gray-500">Registered:</span> {new Date(selectedCouple.registeredAt).toLocaleDateString()}</div>
                        <div><span className="text-gray-500">Risk Level:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRiskColor(selectedCouple.riskLevel)}`}>{selectedCouple.riskLevel}</span></div>
                        <div><span className="text-gray-500">Probability:</span> {selectedCouple.probability}%</div>
                      </div>
                    </div>
                    
                    {/* Husband & Wife Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Husband Card */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 border-b">
                          <h3 className="font-semibold text-blue-800"> Husband</h3>
                        </div>
                        <div className="p-4 space-y-2 text-sm">
                          {selectedCouple.husband ? (
                            <>
                              <div className="flex justify-between"><span className="text-gray-500">Full Name:</span> <span className="font-medium">{selectedCouple.husband.fullName}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">Date of Birth:</span> {selectedCouple.husband.dateOfBirth ? new Date(selectedCouple.husband.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                              <div className="flex justify-between"><span className="text-gray-500">Blood Type:</span> {selectedCouple.husband.bloodType || 'N/A'} {selectedCouple.husband.rhFactor ? `(${selectedCouple.husband.rhFactor})` : ''}</div>
                              <div className="flex justify-between"><span className="text-gray-500">Genotype:</span> 
                                <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                                  selectedCouple.husband.genotype === 'SS' ? 'bg-red-100 text-red-700' :
                                  selectedCouple.husband.genotype === 'AS' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>{selectedCouple.husband.genotype || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between"><span className="text-gray-500">Region:</span> {selectedCouple.husband.region || 'N/A'}</div>
                              <div className="flex justify-between"><span className="text-gray-500">Family History:</span> {selectedCouple.husband.familyHistory || 'None'}</div>
                              <div className="flex justify-between"><span className="text-gray-500">Affected Child:</span> {selectedCouple.husband.hasAffectedChild ? 'Yes' : 'No'}</div>
                            </>
                          ) : <p className="text-gray-500">No data available</p>}
                        </div>
                      </div>
                      
                      {/* Wife Card */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-pink-50 px-4 py-3 border-b">
                          <h3 className="font-semibold text-pink-800"> Wife</h3>
                        </div>
                        <div className="p-4 space-y-2 text-sm">
                          {selectedCouple.wife ? (
                            <>
                              <div className="flex justify-between"><span className="text-gray-500">Full Name:</span> <span className="font-medium">{selectedCouple.wife.fullName}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">Date of Birth:</span> {selectedCouple.wife.dateOfBirth ? new Date(selectedCouple.wife.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                              <div className="flex justify-between"><span className="text-gray-500">Blood Type:</span> {selectedCouple.wife.bloodType || 'N/A'} {selectedCouple.wife.rhFactor ? `(${selectedCouple.wife.rhFactor})` : ''}</div>
                              <div className="flex justify-between"><span className="text-gray-500">Genotype:</span>
                                <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                                  selectedCouple.wife.genotype === 'SS' ? 'bg-red-100 text-red-700' :
                                  selectedCouple.wife.genotype === 'AS' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>{selectedCouple.wife.genotype || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between"><span className="text-gray-500">Region:</span> {selectedCouple.wife.region || 'N/A'}</div>
                              <div className="flex justify-between"><span className="text-gray-500">Family History:</span> {selectedCouple.wife.familyHistory || 'None'}</div>
                              <div className="flex justify-between"><span className="text-gray-500">Affected Child:</span> {selectedCouple.wife.hasAffectedChild ? 'Yes' : 'No'}</div>
                            </>
                          ) : <p className="text-gray-500">No data available</p>}
                        </div>
                      </div>
                    </div>
                    
                    {/* Assessment Recommendation */}
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h3 className="font-semibold text-yellow-800 mb-2">📋 Medical Recommendation</h3>
                      <p className="text-gray-700">{selectedCouple.recommendation || 'No recommendation available'}</p>
                      <p className="text-xs text-gray-500 mt-2">Assessment Date: {selectedCouple.assessmentDate ? new Date(selectedCouple.assessmentDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </>
                ) : null}
              </div>
              
              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalConsultant;