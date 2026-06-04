import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/main.css";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cf-body { font-family: 'Inter', sans-serif; background: #fafaf9; min-height: 100vh; }
  .cf-display { font-family: 'Cormorant Garamond', Georgia, serif; }

  @keyframes cf-spin { to { transform: rotate(360deg); } }
  @keyframes cf-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cf-pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.4; transform:scale(.6); }
  }
  @keyframes cf-bar-grow {
    from { width: 0; }
  }
  .cf-fade-up { animation: cf-fadeUp 0.5s ease both; }
  .cf-pulse   { animation: cf-pulse-dot 2.2s infinite; }

  /* ── Page layout ── */
  .cf-page {
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 20px 80px;
  }

  /* ── Page header ── */
  .cf-page-header {
    text-align: center;
    margin-bottom: 40px;
  }
  .cf-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: #7f1d1d; color: #fecaca;
    font-size: 10px; font-weight: 600; letter-spacing: 0.16em;
    text-transform: uppercase; padding: 5px 14px; border-radius: 999px;
    margin-bottom: 16px;
  }

  /* ── Card ── */
  .cf-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #f0e8e8;
    box-shadow: 0 4px 32px rgba(127,29,29,0.07);
    overflow: hidden;
    margin-bottom: 28px;
  }
  .cf-card-header {
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    padding: 20px 28px;
    display: flex; align-items: center; gap: 14px;
  }
  .cf-card-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
    flex-shrink: 0;
  }
  .cf-card-body { padding: 28px; }

  /* ── Two-column grid inside cards ── */
  .cf-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 640px) {
    .cf-grid { grid-template-columns: 1fr; }
    .cf-span2 { grid-column: span 1 !important; }
  }
  .cf-span2 { grid-column: span 2; }

  /* ── Inputs / selects ── */
  .cf-label {
    display: block; font-size: 11px; font-weight: 600;
    color: #6b7280; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 7px;
  }
  .cf-input, .cf-select {
    width: 100%; background: #fafafa; border: 1px solid #e5e7eb;
    border-radius: 10px; padding: 12px 14px;
    font-size: 14px; font-family: 'Inter', sans-serif; color: #111827;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    appearance: none; -webkit-appearance: none;
  }
  .cf-input::placeholder { color: #9ca3af; }
  .cf-input:focus, .cf-select:focus {
    border-color: #b91c1c; background: #fff;
    box-shadow: 0 0 0 3px rgba(185,28,28,0.08);
  }
  .cf-select-wrap { position: relative; }
  .cf-select-wrap::after {
    content: '▾'; position: absolute; right: 13px; top: 50%;
    transform: translateY(-50%); color: #9ca3af; pointer-events: none; font-size: 13px;
  }

  /* ── Husband/Wife column headers ── */
  .cf-person-header {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: #7f1d1d; margin-bottom: 16px;
    padding-bottom: 10px; border-bottom: 1px solid #f0e8e8;
  }
  .cf-person-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #b91c1c;
    flex-shrink: 0;
  }

  /* ── Divider ── */
  .cf-divider {
    height: 1px; background: #f0e8e8; margin: 4px 0 20px;
  }

  /* ── Submit button ── */
  .cf-submit {
    width: 100%;
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    color: #fff; font-family: 'Inter', sans-serif;
    font-size: 15px; font-weight: 600; letter-spacing: 0.05em;
    padding: 15px; border-radius: 12px; border: none; cursor: pointer;
    box-shadow: 0 4px 16px rgba(127,29,29,0.35);
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    margin-top: 8px;
  }
  .cf-submit:hover:not(:disabled) {
    opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(127,29,29,0.4);
  }
  .cf-submit:active { transform: translateY(0); }
  .cf-submit:disabled { background: #d1d5db; box-shadow: none; cursor: not-allowed; }

  /* ── Spinner ── */
  .cf-spinner {
    width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: cf-spin 0.7s linear infinite;
  }

  /* ── Notice banner ── */
  .cf-notice {
    background: #fffbeb; border: 1px solid #fcd34d;
    border-left: 4px solid #f59e0b; border-radius: 10px;
    padding: 14px 20px; display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 28px;
  }
  .cf-notice-locked {
    background: #fef2f2; border: 1px solid #fca5a5;
    border-left: 4px solid #b91c1c; border-radius: 10px;
    padding: 14px 20px; display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 28px;
  }

  /* ── Result card ── */
  .cf-result {
    background: #fff; border-radius: 20px;
    border: 1px solid #f0e8e8;
    box-shadow: 0 8px 40px rgba(127,29,29,0.1);
    overflow: hidden;
    animation: cf-fadeUp 0.5s ease both;
  }
  .cf-result-header {
    padding: 24px 32px;
    display: flex; align-items: center; gap: 14px;
  }
  .cf-result-body { padding: 28px 32px; }

  .cf-prob-bar-track {
    background: #f0e8e8; border-radius: 999px; height: 10px; overflow: hidden; margin-top: 8px;
  }
  .cf-prob-bar-fill {
    height: 100%; border-radius: 999px;
    animation: cf-bar-grow 1.2s cubic-bezier(.22,1,.36,1) both;
    animation-delay: 0.3s;
  }

  .cf-rec-box {
    border-radius: 10px; padding: 16px 20px; margin: 20px 0;
  }
  .cf-genotype-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px;
  }
  @media (max-width: 480px) { .cf-genotype-grid { grid-template-columns: 1fr; } }
  .cf-genotype-card {
    background: #fafaf9; border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 14px 16px; text-align: center;
  }

  .cf-chat-link {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    color: #fff; text-decoration: none;
    padding: 12px 24px; border-radius: 10px;
    font-size: 14px; font-weight: 600;
    box-shadow: 0 4px 14px rgba(127,29,29,0.3);
    transition: opacity 0.2s, transform 0.15s;
  }
  .cf-chat-link:hover { opacity: 0.9; transform: translateY(-1px); }

  /* ── Full-page loader ── */
  .cf-loading-screen {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; min-height: 100vh; gap: 16px;
  }
  .cf-big-spinner {
    width: 48px; height: 48px; border: 4px solid #f0e8e8;
    border-top-color: #b91c1c; border-radius: 50%;
    animation: cf-spin 0.8s linear infinite;
  }
`;

function CoupleForm() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") navigate("/login");
  }, [navigate]);

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
      .finally(() => setChecking(false));
  }, [coupleID]);

  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return "#888";
    const l = riskLevel.toLowerCase();
    if (l.includes("critical")) return "#7b0000";
    if (l.includes("very high")) return "#b30000";
    if (l.includes("high")) return "#d94f00";
    if (l.includes("moderate") || l.includes("carrier")) return "#e08c00";
    return "#2e7d32";
  };
  const getRiskIcon = (riskLevel) => {
    if (!riskLevel) return "🧬";
    const l = riskLevel.toLowerCase();
    if (l.includes("critical") || l.includes("very high")) return "🔴";
    if (l.includes("high")) return "🟠";
    if (l.includes("moderate") || l.includes("carrier")) return "🟡";
    return "🟢";
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingFields = Object.keys(formData).filter(
      (k) => formData[k] === "",
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
        { coupleId: coupleID, persons },
      );
      if (response.status === 200) {
        const result = response.data.assessment;
        setAssessment(result);
        setExistingData({
          assessment: result,
          husband: persons.find((p) => p.role === "Husband"),
          wife: persons.find((p) => p.role === "Wife"),
        });
        setTimeout(
          () =>
            document
              .getElementById("result-card")
              ?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading screen ──
  if (checking)
    return (
      <>
        <style>{injectStyles}</style>
        <div className="cf-body">
          <div className="cf-loading-screen">
            <div className="cf-big-spinner" />
            <p
              style={{
                color: "#9ca3af",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Loading your data…
            </p>
          </div>
        </div>
      </>
    );

  // ── Result card component ──
  const ResultCard = ({ assessmentData, husband, wife }) => {
    const color = getRiskColor(assessmentData.riskLevel);
    return (
      <div id="result-card" className="cf-result">
        {/* Colored header */}
        <div
          className="cf-result-header"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          }}
        >
          <span style={{ fontSize: 32 }}>
            {getRiskIcon(assessmentData.riskLevel)}
          </span>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              Assessment Result
            </p>
            <h3
              className="cf-display"
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {assessmentData.riskLevel}
            </h3>
          </div>
        </div>

        <div className="cf-result-body">
          {/* Probability bar */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Risk Probability
              </span>
              <span style={{ fontSize: 22, fontWeight: 800, color }}>
                {assessmentData.probability}%
              </span>
            </div>
            <div className="cf-prob-bar-track">
              <div
                className="cf-prob-bar-fill"
                style={{
                  width: `${assessmentData.probability}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}99)`,
                }}
              />
            </div>
          </div>

          {/* Recommendation */}
          <div
            className="cf-rec-box"
            style={{
              background: "#fdf5f5",
              border: `1px solid ${color}33`,
              borderLeft: `4px solid ${color}`,
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 11,
                color: "#9ca3af",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Recommendation
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: "#374151",
                lineHeight: 1.65,
              }}
            >
              {assessmentData.recommendation}
            </p>
          </div>

          {/* Genotypes */}
          <div className="cf-genotype-grid">
            {[
              { label: "Husband", data: husband },
              { label: "Wife", data: wife },
            ].map(({ label, data }) => (
              <div key={label} className="cf-genotype-card">
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    margin: "4px 0 2px",
                    fontSize: 13,
                    color: "#6b7280",
                  }}
                >
                  {data?.fullName || "—"}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#7f1d1d",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  {(data?.genotype || "").toUpperCase()}
                </p>
              </div>
            ))}
          </div>

          {/* Dates + disclaimer */}
          {assessmentData.createdAt && (
            <p
              style={{
                marginTop: 20,
                fontSize: 12,
                color: "#d1d5db",
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
              margin: "8px 0 24px",
              fontSize: 12,
              color: "#9ca3af",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            ⚕️ This result is for informational purposes only. Please consult a
            licensed genetic counselor.
          </p>

          {/* Chat link */}
          <div style={{ textAlign: "center" }}>
            <Link to="/chatbot" className="cf-chat-link">
              <span>💬</span> Discuss with AI Counselor
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // ── Existing result view (form locked) ──
  if (existingData && assessment)
    return (
      <>
        <style>{injectStyles}</style>
        <div className="cf-body">
          <div className="cf-page">
            {/* Page header */}
            <div className="cf-page-header cf-fade-up">
              <div className="cf-badge">
                <span
                  className="cf-pulse"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fca5a5",
                    display: "inline-block",
                  }}
                />
                Lebanon Gene
              </div>
              <h1
                className="cf-display"
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: "#7f1d1d",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Your Assessment
              </h1>
            </div>

            {/* Locked notice */}
            <div className="cf-notice-locked cf-fade-up">
              <span style={{ fontSize: 18 }}>🔒</span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    color: "#7f1d1d",
                    fontSize: 14,
                  }}
                >
                  Form Locked
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#991b1b",
                    fontSize: 13,
                    fontWeight: 300,
                  }}
                >
                  Your genetic assessment has already been submitted. Your
                  results are permanently saved below.
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
      </>
    );

  // ── REGIONS helper ──
  const regions = [
    { v: "1", l: "Beirut" },
    { v: "2", l: "Mount Lebanon" },
    { v: "3", l: "Keserwan-Jbeil" },
    { v: "4", l: "North" },
    { v: "5", l: "Akkar" },
    { v: "6", l: "Bekaa" },
    { v: "7", l: "Baalbek-Hermel" },
    { v: "8", l: "South" },
    { v: "9", l: "Nabatieh" },
  ];

  // Helper to render a labeled field
  const Field = ({ label, children }) => (
    <div>
      <label className="cf-label">{label}</label>
      {children}
    </div>
  );

  const SelectWrap = ({ children }) => (
    <div className="cf-select-wrap">{children}</div>
  );

  // ── Main form view ──
  return (
    <>
      <style>{injectStyles}</style>
      <div className="cf-body">
        <div className="cf-page">
          {/* Page header */}
          <div className="cf-page-header cf-fade-up">
            <div className="cf-badge">
              <span
                className="cf-pulse"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#fca5a5",
                  display: "inline-block",
                }}
              />
              Lebanon Gene
            </div>
            <h1
              className="cf-display"
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: "#7f1d1d",
                lineHeight: 1.1,
                margin: "0 0 10px",
              }}
            >
              Genetic Compatibility
            </h1>
            <p
              style={{
                color: "#9ca3af",
                fontSize: 15,
                fontWeight: 300,
                margin: 0,
              }}
            >
              Analyze the probability of passing sickle cell disease to your
              children.
            </p>
            <p style={{ marginTop: 10, fontSize: 13, color: "#9ca3af" }}>
              Have questions?{" "}
              <Link
                to="/chatbot"
                style={{
                  color: "#7f1d1d",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Chat with our AI Counselor →
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ── PERSONAL INFORMATION ── */}
            <div className="cf-card cf-fade-up">
              <div className="cf-card-header">
                <div className="cf-card-icon">👤</div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Personal Information
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 300,
                    }}
                  >
                    Full names and dates of birth
                  </p>
                </div>
              </div>
              <div className="cf-card-body">
                <div className="cf-grid">
                  <div>
                    <div className="cf-person-header">
                      <div className="cf-person-dot" />
                      Husband
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      <Field label="Full Name">
                        <input
                          type="text"
                          name="husbandFullName"
                          placeholder="e.g. Ahmad Khalil"
                          onChange={handleChange}
                          className="cf-input"
                        />
                      </Field>
                      <Field label="Date of Birth">
                        <input
                          type="text"
                          name="husbandDOB"
                          placeholder="Husband's Date of Birth"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                          }}
                          onChange={handleChange}
                          className="cf-input"
                          required
                        />
                      </Field>
                    </div>
                  </div>
                  <div>
                    <div className="cf-person-header">
                      <div
                        className="cf-person-dot"
                        style={{ background: "#e08c00" }}
                      />
                      Wife
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      <Field label="Full Name">
                        <input
                          type="text"
                          name="wifeFullName"
                          placeholder="e.g. Sara Hassan"
                          onChange={handleChange}
                          className="cf-input"
                        />
                      </Field>
                      <Field label="Date of Birth">
                        <input
                          type="text"
                          name="wifeDOB"
                          placeholder="Wife's Date of Birth"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                          }}
                          onChange={handleChange}
                          className="cf-input"
                          required
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── LOCATION ── */}
            <div className="cf-card cf-fade-up">
              <div className="cf-card-header">
                <div className="cf-card-icon">📍</div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Region
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 300,
                    }}
                  >
                    Geographic origin in Lebanon
                  </p>
                </div>
              </div>
              <div className="cf-card-body">
                <div className="cf-grid">
                  <Field label="Husband's Region">
                    <SelectWrap>
                      <select
                        name="husbandRegion"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Select region…</option>
                        {regions.map((r) => (
                          <option key={r.v} value={r.v}>
                            {r.l}
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label="Wife's Region">
                    <SelectWrap>
                      <select
                        name="wifeRegion"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Select region…</option>
                        {regions.map((r) => (
                          <option key={r.v} value={r.v}>
                            {r.l}
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </Field>
                </div>
              </div>
            </div>

            {/* ── BLOOD DATA ── */}
            <div className="cf-card cf-fade-up">
              <div className="cf-card-header">
                <div className="cf-card-icon">🩸</div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Blood Type & Rh Factor
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 300,
                    }}
                  >
                    ABO group and Rhesus factor
                  </p>
                </div>
              </div>
              <div className="cf-card-body">
                <div className="cf-grid">
                  <Field label="Husband's Blood Type">
                    <SelectWrap>
                      <select
                        name="husbandbloodtype"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Select…</option>
                        {["O", "A", "B", "AB"].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label="Wife's Blood Type">
                    <SelectWrap>
                      <select
                        name="wifebloodtype"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Select…</option>
                        {["O", "A", "B", "AB"].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label="Husband's Rh Factor">
                    <SelectWrap>
                      <select
                        name="husbandrhfactor"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Select…</option>
                        <option value="+">Positive (+)</option>
                        <option value="-">Negative (−)</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label="Wife's Rh Factor">
                    <SelectWrap>
                      <select
                        name="wiferhfactor"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Select…</option>
                        <option value="+">Positive (+)</option>
                        <option value="-">Negative (−)</option>
                      </select>
                    </SelectWrap>
                  </Field>
                </div>
              </div>
            </div>

            {/* ── GENETIC DATA ── */}
            <div className="cf-card cf-fade-up">
              <div className="cf-card-header">
                <div className="cf-card-icon">🧬</div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Genotype & Family History
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 300,
                    }}
                  >
                    Sickle cell genotype and hereditary background
                  </p>
                </div>
              </div>
              <div className="cf-card-body">
                <div className="cf-grid">
                  <Field label="Husband's Genotype">
                    <SelectWrap>
                      <select
                        name="husbandgenotype"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Select…</option>
                        <option value="AA">AA — Normal</option>
                        <option value="AS">AS — Carrier</option>
                        <option value="SS">SS — Affected</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label="Wife's Genotype">
                    <SelectWrap>
                      <select
                        name="wifegenotype"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Select…</option>
                        <option value="AA">AA — Normal</option>
                        <option value="AS">AS — Carrier</option>
                        <option value="SS">SS — Affected</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label="Husband's Family History">
                    <SelectWrap>
                      <select
                        name="HusbandfamilyHistory"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Is husband's family affected?</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <Field label="Wife's Family History">
                    <SelectWrap>
                      <select
                        name="WifefamilyHistory"
                        onChange={handleChange}
                        className="cf-select"
                      >
                        <option value="">Is wife's family affected?</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </SelectWrap>
                  </Field>
                  <div className="cf-span2">
                    <Field label="Do you have an affected child together?">
                      <SelectWrap>
                        <select
                          name="affected"
                          onChange={handleChange}
                          className="cf-select"
                        >
                          <option value="">Select…</option>
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </SelectWrap>
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            {/* ── SUBMIT ── */}
            <button
              type="submit"
              className="cf-submit cf-fade-up"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="cf-spinner" />
                  <span>Analyzing…</span>
                </>
              ) : (
                <>
                  <span>Run Genetic Assessment</span>
                  <span style={{ fontSize: 18 }}>→</span>
                </>
              )}
            </button>
          </form>

          {/* Result card appears below after submit */}
          {assessment && existingData && (
            <div style={{ marginTop: 40 }}>
              <ResultCard
                assessmentData={existingData.assessment}
                husband={existingData.husband}
                wife={existingData.wife}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default CoupleForm;
