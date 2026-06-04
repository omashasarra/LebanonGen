import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/main.css";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600&display=swap');

  .dr-font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .dr-font-body    { font-family: 'Inter', sans-serif; }

  @keyframes dr-pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.65); }
  }
  .dr-animate-pulse { animation: dr-pulse-dot 2.2s infinite; }

  @keyframes dr-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .dr-fade-up { animation: dr-fadeUp 0.55s ease both; }
  .dr-fade-up-1 { animation-delay: 0.05s; }
  .dr-fade-up-2 { animation-delay: 0.13s; }
  .dr-fade-up-3 { animation-delay: 0.21s; }
  .dr-fade-up-4 { animation-delay: 0.29s; }

  /* Left panel */
  .dr-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .dr-radial-glow {
    background: radial-gradient(ellipse 65% 55% at 50% 50%, rgba(185,28,28,0.5) 0%, transparent 75%);
  }
  .dr-hex-pattern {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='0.025' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.85v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  /* Stat cards on left panel */
  .dr-stat-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: background 0.2s;
  }
  .dr-stat-card:hover { background: rgba(255,255,255,0.1); }

  .dr-icon-box {
    width: 36px; height: 36px;
    border-radius: 9px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  /* Right panel / form */
  .dr-input {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 13px 16px 13px 42px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .dr-input::placeholder { color: #9ca3af; }
  .dr-input:focus {
    border-color: #b91c1c;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(185,28,28,0.08);
  }

  .dr-input-wrap {
    position: relative;
  }
  .dr-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    font-size: 15px;
    pointer-events: none;
    transition: color 0.2s;
  }
  .dr-input-wrap:focus-within .dr-input-icon { color: #b91c1c; }

  .dr-btn {
    width: 100%;
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 14px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(127,29,29,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .dr-btn:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(127,29,29,0.4);
  }
  .dr-btn:active { transform: translateY(0); }

  .dr-divider { flex: 1; height: 1px; background: #e5e7eb; }

  .dr-badge-strip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(127,29,29,0.07);
    border: 1px solid rgba(185,28,28,0.15);
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 24px;
  }

  /* Responsive overrides */
  @media (max-width: 1023px) {
    .dr-left-panel { display: none !important; }
  }
`;

function Drlog() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/doctor-login`,
        formData
      );

      if (response.status === 200) {
        localStorage.setItem("drToken", response.data.token);
        localStorage.setItem("drRole", response.data.role);
        localStorage.setItem("drName", response.data.name);
        localStorage.setItem("drEmail", formData.email);

        alert(`Access Granted. Welcome, ${response.data.name}`);

        const userRole = response.data.role;
        if (userRole === "doctor") {
          navigate("/dashboard/consultant");
        } else if (userRole === "researcher") {
          navigate("/dashboard/researcher");
        } else if (userRole === "admin") {
          navigate("/dashboard/admin");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Unauthorized access.");
    }
  };

  return (
    <>
      <style>{injectStyles}</style>

      <div className="dr-font-body" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ── MAIN AREA ── */}
        <div style={{ flex: 1, display: "flex" }}>

          {/* ── LEFT PANEL ── */}
          <div
            className="dr-left-panel"
            style={{
              width: "52%",
              position: "relative",
              background: "#450a0a",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Layered backgrounds */}
            <div className="dr-grid-bg" style={{ position: "absolute", inset: 0 }} />
            <div className="dr-hex-pattern" style={{ position: "absolute", inset: 0 }} />
            <div className="dr-radial-glow" style={{ position: "absolute", inset: 0 }} />

            {/* Rings */}
            <div style={{
              position: "absolute", borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.06)",
              width: 420, height: 420,
              top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.03)",
              width: 700, height: 700,
              top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              pointerEvents: "none",
            }} />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 10, padding: "0 64px", textAlign: "center", maxWidth: 440 }}>

              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#fca5a5",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.18em",
                textTransform: "uppercase", padding: "6px 16px",
                borderRadius: 999, marginBottom: 36,
              }}>
                <span className="dr-animate-pulse" style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#fca5a5", display: "inline-block"
                }} />
                Staff Access
              </div>

              <h2 className="dr-font-display" style={{
                fontSize: 52, fontWeight: 700, color: "#fff",
                lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 16,
              }}>
                Medical Staff<br />
                <em style={{ fontStyle: "normal", color: "#fca5a5" }}>Portal</em>
              </h2>

              <p style={{
                color: "rgba(255,255,255,0.45)", fontSize: 14,
                fontWeight: 300, lineHeight: 1.7, marginBottom: 40,
              }}>
                Authorized access for clinicians, researchers, and administrators
                managing sickle cell genetic analytics.
              </p>

              {/* Role cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
                {[
                  { icon: "🩺", role: "Consultant Doctors", desc: "View patient risk assessments" },
                  { icon: "🔬", role: "Researchers", desc: "Access anonymized regional data" },
                  { icon: "⚙️",  role: "Administrators", desc: "Manage users and platform settings" },
                ].map(({ icon, role, desc }) => (
                  <div key={role} className="dr-stat-card">
                    <div className="dr-icon-box">{icon}</div>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600 }}>{role}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 300, marginTop: 2 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom */}
            <div style={{
              position: "absolute", bottom: 36, left: 0, right: 0,
              padding: "0 64px", textAlign: "center",
            }}>
              <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.12)", margin: "0 auto 16px" }} />
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", fontStyle: "italic" }}>
                "Clinical precision, powered by AI."
              </p>
            </div>
          </div>

          {/* ── RIGHT PANEL — form ── */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#fafaf9",
            padding: "48px 24px",
          }}>

            {/* Mobile badge */}
            <div style={{ display: "none" }} className="dr-mobile-badge">
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#450a0a", color: "#fca5a5",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.18em",
                textTransform: "uppercase", padding: "6px 16px",
                borderRadius: 999, marginBottom: 32,
              }}>
                <span className="dr-animate-pulse" style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#fca5a5", display: "inline-block"
                }} />
                Lebanon Gene
              </div>
            </div>

            <div style={{ width: "100%", maxWidth: 360 }}>

              {/* Heading */}
              <div className="dr-fade-up dr-fade-up-1" style={{ marginBottom: 28 }}>
                <h1 className="dr-font-display" style={{
                  fontSize: 40, fontWeight: 700, color: "#450a0a",
                  lineHeight: 1.15, marginBottom: 8,
                }}>
                  Staff Sign In
                </h1>
                <p style={{ color: "#9ca3af", fontSize: 14, fontWeight: 300, lineHeight: 1.6 }}>
                  Enter your professional credentials to access the clinical dashboard.
                </p>
              </div>

              {/* Security notice */}
              <div className="dr-fade-up dr-fade-up-2 dr-badge-strip">
                <span style={{ fontSize: 14 }}>🔒</span>
                <span style={{ fontSize: 12, color: "#7f1d1d", fontWeight: 500 }}>
                  Authorized personnel only. All access is logged.
                </span>
              </div>

              {/* Divider */}
              <div className="dr-fade-up dr-fade-up-2" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div className="dr-divider" />
                <span style={{ fontSize: 10, color: "#9ca3af", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, whiteSpace: "nowrap" }}>
                  Secure Authentication
                </span>
                <div className="dr-divider" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                <div className="dr-fade-up dr-fade-up-3">
                  <label style={{
                    display: "block", fontSize: 11, fontWeight: 600,
                    color: "#6b7280", letterSpacing: "0.1em",
                    textTransform: "uppercase", marginBottom: 8,
                  }}>
                    Professional Email
                  </label>
                  <div className="dr-input-wrap">
                    <span className="dr-input-icon">✉</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="doctor@hospital.com"
                      onChange={handleChange}
                      className="dr-input"
                      required
                    />
                  </div>
                </div>

                <div className="dr-fade-up dr-fade-up-3">
                  <label style={{
                    display: "block", fontSize: 11, fontWeight: 600,
                    color: "#6b7280", letterSpacing: "0.1em",
                    textTransform: "uppercase", marginBottom: 8,
                  }}>
                    Security Password
                  </label>
                  <div className="dr-input-wrap">
                    <span className="dr-input-icon">⬤</span>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      onChange={handleChange}
                      className="dr-input"
                      required
                    />
                  </div>
                </div>

                {/* Forgot */}
                <div className="dr-fade-up dr-fade-up-3" style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
                  <a
                    href="mailto:samer.fares@lebanongen.com"
                    style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseOver={e => e.target.style.color = "#b91c1c"}
                    onMouseOut={e => e.target.style.color = "#9ca3af"}
                  >
                    Forgot credentials? Contact Admin
                  </a>
                </div>

                <div className="dr-fade-up dr-fade-up-4">
                  <button type="submit" className="dr-btn">
                    <span>Authenticate & Enter</span>
                    <span style={{ fontSize: 16 }}>→</span>
                  </button>
                </div>
              </form>

              {/* Bottom note */}
              <div className="dr-fade-up dr-fade-up-4" style={{
                marginTop: 36, paddingTop: 24,
                borderTop: "1px solid #e5e7eb", textAlign: "center",
              }}>
                <p style={{ fontSize: 11, color: "#d1d5db", fontWeight: 300, letterSpacing: "0.04em" }}>
                  This portal is restricted to authorized clinical staff only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile badge show fix */}
      <style>{`
        @media (max-width: 1023px) {
          .dr-mobile-badge { display: block !important; text-align: center; }
        }
      `}</style>
    </>
  );
}

export default Drlog;