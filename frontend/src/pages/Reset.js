import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600&display=swap');
  .rst-font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .rst-font-body    { font-family: 'Inter', sans-serif; }

  @keyframes rst-pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.65); }
  }
  .rst-pulse { animation: rst-pulse-dot 2.2s infinite; }

  @keyframes rst-fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .rst-fu   { animation: rst-fadeUp 0.5s ease both; }
  .rst-fu-1 { animation-delay: 0.05s; }
  .rst-fu-2 { animation-delay: 0.12s; }
  .rst-fu-3 { animation-delay: 0.19s; }
  .rst-fu-4 { animation-delay: 0.26s; }
  .rst-fu-5 { animation-delay: 0.33s; }

  .rst-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .rst-radial {
    background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(185,28,28,0.5) 0%, transparent 75%);
  }

  .rst-input {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 13px 16px 13px 42px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .rst-input::placeholder { color: #9ca3af; }
  .rst-input:focus {
    border-color: #b91c1c;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(185,28,28,0.08);
  }
  .rst-input-wrap { position: relative; }
  .rst-input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #9ca3af; font-size: 14px; pointer-events: none;
    transition: color 0.2s;
  }
  .rst-input-wrap:focus-within .rst-input-icon { color: #b91c1c; }

  .rst-btn {
    width: 100%;
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 600;
    letter-spacing: 0.05em;
    padding: 14px; border-radius: 10px;
    border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(127,29,29,0.35);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .rst-btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(127,29,29,0.4); }
  .rst-btn:active { transform: translateY(0); }

  .rst-divider { flex: 1; height: 1px; background: #e5e7eb; }

  .rst-step {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .rst-step:last-child { border-bottom: none; }
  .rst-step-num {
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; color: #fecaca; flex-shrink: 0; margin-top: 1px;
  }

  .rst-strength-bar {
    height: 3px; border-radius: 99px;
    background: #e5e7eb; overflow: hidden; margin-top: 6px;
  }
  .rst-strength-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.3s, background 0.3s;
  }

  @media (max-width: 1023px) {
    .rst-left { display: none !important; }
  }
`;

function getStrength(pw) {
  if (!pw) return { width: "0%", color: "#e5e7eb", label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { width: "20%", color: "#ef4444", label: "Weak" },
    { width: "45%", color: "#f97316", label: "Fair" },
    { width: "70%", color: "#eab308", label: "Good" },
    { width: "100%", color: "#22c55e", label: "Strong" },
  ];
  return map[score - 1] || { width: "10%", color: "#ef4444", label: "Weak" };
}

function Reset() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        alert("Password updated successfully");
        navigate("/");
      } else {
        alert(data.message || "Reset failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const strength = getStrength(formData.newPassword);

  return (
    <div
      className="rst-font-body"
      style={{ minHeight: "100vh", display: "flex" }}
    >
      <style>{injectStyles}</style>

      {/* ── LEFT PANEL ── */}
      <div
        className="rst-left"
        style={{
          width: "52%",
          position: "relative",
          background: "#991b1b",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          className="rst-grid-bg"
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          className="rst-radial"
          style={{ position: "absolute", inset: 0 }}
        />

        {[400, 680].map((s) => (
          <div
            key={s}
            style={{
              position: "absolute",
              borderRadius: "50%",
              border: `1px solid rgba(255,255,255,${s === 400 ? 0.07 : 0.03})`,
              width: s,
              height: s,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "0 64px",
            textAlign: "center",
            maxWidth: 440,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fecaca",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "6px 16px",
              borderRadius: 999,
              marginBottom: 36,
            }}
          >
            <span
              className="rst-pulse"
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

          <h2
            className="rst-font-display"
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Secure your
            <br />
            <em style={{ fontStyle: "normal", color: "#fecaca" }}>account</em>
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 14,
              fontWeight: 300,
              lineHeight: 1.7,
              marginBottom: 40,
            }}
          >
            Follow the steps below to update your credentials and keep your
            genetic data protected.
          </p>

          {/* Steps */}
          <div style={{ textAlign: "left" }}>
            {[
              { n: "1", text: "Enter your registered email address" },
              { n: "2", text: "Confirm your current password" },
              { n: "3", text: "Choose a strong new password" },
            ].map(({ n, text }) => (
              <div key={n} className="rst-step">
                <div className="rst-step-num">{n}</div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: 0,
            right: 0,
            padding: "0 64px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 1,
              background: "rgba(255,255,255,0.15)",
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 11,
              fontWeight: 300,
              fontStyle: "italic",
            }}
          >
            "Your privacy is our priority."
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafaf9",
          padding: "48px 24px",
        }}
      >
        {/* Mobile badge */}
        <div
          className="rst-mobile-badge"
          style={{ marginBottom: 32, textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#991b1b",
              color: "#fecaca",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "6px 16px",
              borderRadius: 999,
            }}
          >
            <span
              className="rst-pulse"
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
        </div>

        <div style={{ width: "100%", maxWidth: 360 }}>
          <div className="rst-fu rst-fu-1" style={{ marginBottom: 28 }}>
            <h1
              className="rst-font-display"
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: "#7f1d1d",
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              Reset Password
            </h1>
            <p
              style={{
                color: "#9ca3af",
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              Enter your current password and choose a new one.
            </p>
          </div>

          {/* Divider */}
          <div
            className="rst-fu rst-fu-2"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div className="rst-divider" />
            <span
              style={{
                fontSize: 10,
                color: "#9ca3af",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Credential Update
            </span>
            <div className="rst-divider" />
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div className="rst-fu rst-fu-2">
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b7280",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Email Address
              </label>
              <div className="rst-input-wrap">
                <span className="rst-input-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className="rst-input"
                  required
                />
              </div>
            </div>

            <div className="rst-fu rst-fu-3">
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b7280",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Current Password
              </label>
              <div className="rst-input-wrap">
                <span className="rst-input-icon">🔓</span>
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="rst-input"
                  required
                />
              </div>
            </div>

            <div className="rst-fu rst-fu-4">
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b7280",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                New Password
              </label>
              <div className="rst-input-wrap">
                <span className="rst-input-icon">🔑</span>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Choose a strong password"
                  onChange={handleChange}
                  className="rst-input"
                  required
                />
              </div>
              {formData.newPassword && (
                <div>
                  <div className="rst-strength-bar">
                    <div
                      className="rst-strength-fill"
                      style={{
                        width: strength.width,
                        background: strength.color,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: strength.color,
                      fontWeight: 500,
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="rst-fu rst-fu-4">
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6b7280",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Confirm New Password
              </label>
              <div className="rst-input-wrap">
                <span className="rst-input-icon">🔑</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="rst-input"
                  required
                />
              </div>
              {formData.confirmPassword && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    marginTop: 4,
                    display: "block",
                    color:
                      formData.newPassword === formData.confirmPassword
                        ? "#22c55e"
                        : "#ef4444",
                  }}
                >
                  {formData.newPassword === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords don't match"}
                </span>
              )}
            </div>

            <div className="rst-fu rst-fu-5">
              <button type="submit" className="rst-btn">
                <span>Update Password</span>
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            </div>
          </form>

          <div
            className="rst-fu rst-fu-5"
            style={{ marginTop: 24, textAlign: "center" }}
          >
            <p style={{ fontSize: 14, color: "#9ca3af", fontWeight: 300 }}>
              Back to{" "}
              <a
                href="/login"
                style={{
                  color: "#7f1d1d",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign In
              </a>
            </p>
          </div>

          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#d1d5db",
                fontWeight: 300,
                letterSpacing: "0.04em",
              }}
            >
              This portal is intended for authorized clinical use only.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) { .rst-mobile-badge { display: none !important; } }
        @media (max-width: 1023px) { .rst-mobile-badge { display: block !important; } }
      `}</style>
    </div>
  );
}

export default Reset;
