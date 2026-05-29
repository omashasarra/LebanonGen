import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/main.css";

function CoupleForm() {
  const coupleID = localStorage.getItem("coupleID");

  const [formData, setFormData] = useState({
    husbandFullName: "",
    husbandDOB: "",
    husbandRegion: "",
    husbandbloodtype: "",
    husbandrhfactor: "",
    husbandgenotype: "",
    HusbandfamilyHistory: "",
    wifeFullName: "",
    wifeDOB: "",
    wifeRegion: "",
    wifebloodtype: "",
    wiferhfactor: "",
    wifegenotype: "",
    WifefamilyHistory: "",
    affected: "",
  });

  const [assessment, setAssessment] = useState(null);
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!coupleID) {
      setChecking(false);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/couple-assessment/${coupleID}`)
      .then((res) => {
        setExistingData(res.data);
        setAssessment(res.data.assessment);
      })
      .catch(() => {})
      .finally(() => {
        setChecking(false);
      });
  }, [coupleID]);

  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return "#888";
    const level = riskLevel.toLowerCase();
    if (level.includes("critical")) return "#7b0000";
    if (level.includes("very high")) return "#b30000";
    if (level.includes("high")) return "#d94f00";
    if (level.includes("moderate") || level.includes("carrier"))
      return "#e08c00";
    return "#2e7d32";
  };

  const getRiskIcon = (riskLevel) => {
    if (!riskLevel) return "🧬";
    const level = riskLevel.toLowerCase();
    if (level.includes("critical") || level.includes("very high")) return "🔴";
    if (level.includes("high")) return "🟠";
    if (level.includes("moderate") || level.includes("carrier")) return "🟡";
    return "🟢";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = Object.keys(formData).filter(
      (key) => formData[key] === "",
    );
    if (missingFields.length > 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    if (!coupleID) {
      alert("Session expired. Please log in again.");
      return;
    }

    const persons = [
      {
        coupleID,
        fullName: formData.husbandFullName,
        role: "Husband",
        dob: formData.husbandDOB,
        gender: "Male",
        region: formData.husbandRegion,
        bloodType: formData.husbandbloodtype,
        rhFactor: formData.husbandrhfactor,
        genotype: formData.husbandgenotype,
        familyHistory: parseInt(formData.HusbandfamilyHistory, 10),
        hasAffectedChild: parseInt(formData.affected, 10),
      },
      {
        coupleID,
        fullName: formData.wifeFullName,
        role: "Wife",
        dob: formData.wifeDOB,
        gender: "Female",
        region: formData.wifeRegion,
        bloodType: formData.wifebloodtype,
        rhFactor: formData.wiferhfactor,
        genotype: formData.wifegenotype,
        familyHistory: parseInt(formData.WifefamilyHistory, 10),
        hasAffectedChild: parseInt(formData.affected, 10),
      },
    ];

    setLoading(true);
    setAssessment(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/save-couple-data`,
        {
          coupleId: coupleID,
          persons,
        },
      );

      if (response.status === 200) {
        const result = response.data.assessment;
        setAssessment(result);
        setExistingData({
          assessment: result,
          husband: persons.find((p) => p.role === "Husband"),
          wife: persons.find((p) => p.role === "Wife"),
        });
        setTimeout(() => {
          document
            .getElementById("result-card")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #f0f0f0",
              borderTop: "4px solid #b30000",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#777", fontSize: "14px" }}>
            Loading your data...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const ResultCard = ({ assessmentData, husband, wife }) => (
    <div
      id="result-card"
      style={{
        width: "100%",
        maxWidth: "800px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        overflow: "hidden",
        animation: "fadeSlideIn 0.5s ease",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${getRiskColor(assessmentData.riskLevel)}, ${getRiskColor(assessmentData.riskLevel)}cc)`,
          padding: "24px 32px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>
            {getRiskIcon(assessmentData.riskLevel)}
          </span>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                opacity: 0.85,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Assessment Result
            </p>
            <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>
              {assessmentData.riskLevel}
            </h3>
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#777",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Risk Probability
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: getRiskColor(assessmentData.riskLevel),
              }}
            >
              {assessmentData.probability}%
            </span>
          </div>
          <div
            style={{
              background: "#f0f0f0",
              borderRadius: "999px",
              height: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${assessmentData.probability}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${getRiskColor(assessmentData.riskLevel)}, ${getRiskColor(assessmentData.riskLevel)}99)`,
                borderRadius: "999px",
                transition: "width 1s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: "#fdf5f5",
            border: `1px solid ${getRiskColor(assessmentData.riskLevel)}33`,
            borderLeft: `4px solid ${getRiskColor(assessmentData.riskLevel)}`,
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#777",
              fontWeight: "600",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Recommendation
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              color: "#333",
              lineHeight: "1.6",
            }}
          >
            {assessmentData.recommendation}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <div
            style={{
              flex: 1,
              background: "#f6f7fb",
              borderRadius: "8px",
              padding: "14px 16px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Husband
            </p>
            <p style={{ margin: "4px 0 2px", fontSize: "14px", color: "#555" }}>
              {husband?.fullName || "—"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "800",
                color: "#b30000",
              }}
            >
              {(husband?.genotype || "").toUpperCase()}
            </p>
          </div>
          <div
            style={{
              flex: 1,
              background: "#f6f7fb",
              borderRadius: "8px",
              padding: "14px 16px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Wife
            </p>
            <p style={{ margin: "4px 0 2px", fontSize: "14px", color: "#555" }}>
              {wife?.fullName || "—"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "800",
                color: "#b30000",
              }}
            >
              {(wife?.genotype || "").toUpperCase()}
            </p>
          </div>
        </div>

        {assessmentData.createdAt && (
          <p
            style={{
              margin: "16px 0 0",
              fontSize: "12px",
              color: "#bbb",
              textAlign: "center",
            }}
          >
            Submitted on{" "}
            {new Date(assessmentData.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "12px",
            color: "#aaa",
            textAlign: "center",
          }}
        >
          ⚕️ This result is for informational purposes only. Please consult a
          licensed genetic counselor.
        </p>

        {/* Dynamic Chat Link for Saved Assessment State */}
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link
            to="/chatbot"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#b30000",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(179,0,0,0.2)",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#900000")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#b30000")}
          >
            💬 Discuss Results with AI Counselor
          </Link>
        </div>
      </div>
    </div>
  );

  if (existingData && assessment) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 20px 80px 20px",
            minHeight: "calc(100vh - 160px)",
            gap: "30px",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              width: "100%",
              background: "#fff8e1",
              border: "1px solid #f9a825",
              borderLeft: "4px solid #f9a825",
              borderRadius: "10px",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span>🔒</span>
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: "700",
                  color: "#7a5c00",
                  fontSize: "15px",
                }}
              >
                Form Locked
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#9a7000",
                  fontSize: "13px",
                }}
              >
                Your genetic assessment has already been submitted. Your results
                are permanently saved below.
              </p>
            </div>
          </div>
          <ResultCard
            assessmentData={existingData.assessment}
            husband={existingData.husband}
            wife={existingData.wife}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div
        className="form-wrapper"
        style={{ flexDirection: "column", alignItems: "center", gap: "30px" }}
      >
        <div className="form-card" style={{ maxWidth: "800px" }}>
          <h2 style={{ color: "#b30000" }}>Couple Genetic Compatibility</h2>
          <p className="form-subtitle" style={{ marginBottom: "8px" }}>
            Analyze the probability of passing sickle cell disease to children.
          </p>

          {/* General navigation helper on the active intake layout */}
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
            Have questions before filling out the fields?{" "}
            <Link
              to="/chatbot"
              style={{
                color: "#b30000",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              Chat with our AI Counselor
            </Link>
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <input
              type="text"
              name="husbandFullName"
              placeholder="Husband Full Name"
              onChange={handleChange}
            />
            <input
              type="text"
              name="wifeFullName"
              placeholder="Wife Full Name"
              onChange={handleChange}
            />

            <input
              type="text"
              name="husbandDOB"
              placeholder="Husband's Date of Birth"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (e.target.value === "") e.target.type = "text";
              }}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="wifeDOB"
              placeholder="Wife's Date of Birth"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (e.target.value === "") e.target.type = "text";
              }}
              onChange={handleChange}
              required
            />

            <select name="husbandRegion" onChange={handleChange}>
              <option value="">Husband's Region</option>
              <option value="1">Beirut</option>
              <option value="2">Mount Lebanon</option>
              <option value="3">Keserwan-Jbeil</option>
              <option value="4">North</option>
              <option value="5">Akkar</option>
              <option value="6">Bekaa</option>
              <option value="7">Baalbek-Hermel</option>
              <option value="8">South</option>
              <option value="9">Nabatieh</option>
            </select>
            <select name="wifeRegion" onChange={handleChange}>
              <option value="">Wife's Region</option>
              <option value="1">Beirut</option>
              <option value="2">Mount Lebanon</option>
              <option value="3">Keserwan-Jbeil</option>
              <option value="4">North</option>
              <option value="5">Akkar</option>
              <option value="6">Bekaa</option>
              <option value="7">Baalbek-Hermel</option>
              <option value="8">South</option>
              <option value="9">Nabatieh</option>
            </select>

            <select name="husbandbloodtype" onChange={handleChange}>
              <option value="">Husband's Blood Type</option>
              <option value="O">O</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
            </select>
            <select name="wifebloodtype" onChange={handleChange}>
              <option value="">Wife's Blood Type</option>
              <option value="O">O</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
            </select>

            <select name="husbandrhfactor" onChange={handleChange}>
              <option value="">Husband's Rh Factor</option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
            <select name="wiferhfactor" onChange={handleChange}>
              <option value="">Wife's Rh Factor</option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>

            <select name="husbandgenotype" onChange={handleChange}>
              <option value="">Husband's Genotype</option>
              <option value="AA">AA</option>
              <option value="AS">AS</option>
              <option value="SS">SS</option>
            </select>
            <select name="wifegenotype" onChange={handleChange}>
              <option value="">Wife's Genotype</option>
              <option value="AA">AA</option>
              <option value="AS">AS</option>
              <option value="SS">SS</option>
            </select>

            <select name="HusbandfamilyHistory" onChange={handleChange}>
              <option value="">Is husband's family affected?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <select name="WifefamilyHistory" onChange={handleChange}>
              <option value="">Is wife's family affected?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <select
              name="affected"
              onChange={handleChange}
              style={{ gridColumn: "span 2" }}
            >
              <option value="">Do you have an affected child together?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <button
              type="submit"
              className="submit-btn"
              style={{ gridColumn: "span 2" }}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Submit Form"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoupleForm;
