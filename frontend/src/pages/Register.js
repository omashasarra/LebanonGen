import React, { useState } from "react";
import "../styles/login.css";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600&display=swap');
  .reg-font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .reg-font-body    { font-family: 'Inter', sans-serif; }

  @keyframes reg-pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.65); }
  }
  .reg-pulse { animation: reg-pulse-dot 2.2s infinite; }

  @keyframes reg-fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .reg-fu   { animation: reg-fadeUp 0.5s ease both; }
  .reg-fu-1 { animation-delay: 0.05s; }
  .reg-fu-2 { animation-delay: 0.12s; }
  .reg-fu-3 { animation-delay: 0.19s; }
  .reg-fu-4 { animation-delay: 0.26s; }

  .reg-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .reg-radial {
    background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(220,38,38,0.45) 0%, transparent 75%);
  }

  .reg-input {
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
  .reg-input::placeholder { color: #9ca3af; }
  .reg-input:focus {
    border-color: #b91c1c;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(185,28,28,0.08);
  }
  .reg-input-wrap { position: relative; }
  .reg-input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #9ca3af; font-size: 14px; pointer-events: none;
    transition: color 0.2s;
  }
  .reg-input-wrap:focus-within .reg-input-icon { color: #b91c1c; }

  .reg-btn {
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
  .reg-btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(127,29,29,0.4); }
  .reg-btn:active { transform: translateY(0); }

  .reg-divider { flex: 1; height: 1px; background: #e5e7eb; }

  /* Password strength bar */
  .reg-strength-bar {
    height: 3px; border-radius: 99px;
    background: #e5e7eb; overflow: hidden; margin-top: 6px;
  }
  .reg-strength-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.3s, background 0.3s;
  }

  @media (max-width: 1023px) {
    .reg-left { display: none !important; }
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

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! You can now log in.");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Connection error", error);
    }
  };

  const strength = getStrength(formData.password);

  return (
    <div
      className="reg-font-body"
      style={{ minHeight: "100vh", display: "flex" }}
    >
      <style>{injectStyles}</style>

      {/* ── LEFT PANEL ── */}
      <div
        className="reg-left"
        style={{
          width: "52%",
          position: "relative",
          background: "#7f1d1d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          className="reg-grid-bg"
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          className="reg-radial"
          style={{ position: "absolute", inset: 0 }}
        />

        {/* Rings */}
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
              className="reg-pulse"
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
            className="reg-font-display"
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Join the
            <br />
            <em style={{ fontStyle: "normal", color: "#fecaca" }}>
              screening platform
            </em>
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
            Create your account to begin your couple's sickle cell risk
            assessment — private, secure, and AI-powered.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              textAlign: "left",
            }}
          >
            {[
              { icon: "📋", label: "Complete your genetic profile" },
              { icon: "🧬", label: "Receive AI-powered risk prediction" },
              { icon: "🔒", label: "Your data stays private, always" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 13,
                    fontWeight: 300,
                  }}
                >
                  {label}
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
            "Prevention begins with knowledge."
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
          style={{ marginBottom: 32, textAlign: "center" }}
          className="reg-mobile-badge"
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#7f1d1d",
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
              className="reg-pulse"
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
          <div className="reg-fu reg-fu-1" style={{ marginBottom: 28 }}>
            <h1
              className="reg-font-display"
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: "#7f1d1d",
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              Create Account
            </h1>
            <p
              style={{
                color: "#9ca3af",
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              Register to access your genetic screening dashboard.
            </p>
          </div>

          {/* Divider */}
          <div
            className="reg-fu reg-fu-2"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div className="reg-divider" />
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
              New Registration
            </span>
            <div className="reg-divider" />
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div className="reg-fu reg-fu-2">
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
              <div className="reg-input-wrap">
                <span className="reg-input-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className="reg-input"
                  required
                />
              </div>
            </div>

            <div className="reg-fu reg-fu-3">
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
                Password
              </label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon">🔑</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  className="reg-input"
                  required
                />
              </div>
              {/* Strength bar */}
              {formData.password && (
                <div>
                  <div className="reg-strength-bar">
                    <div
                      className="reg-strength-fill"
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

            <div className="reg-fu reg-fu-3">
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
                Confirm Password
              </label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon">🔑</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="reg-input"
                  required
                />
              </div>
              {/* Match indicator */}
              {formData.confirmPassword && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    marginTop: 4,
                    display: "block",
                    color:
                      formData.password === formData.confirmPassword
                        ? "#22c55e"
                        : "#ef4444",
                  }}
                >
                  {formData.password === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords don't match"}
                </span>
              )}
            </div>

            <div className="reg-fu reg-fu-4">
              <button type="submit" className="reg-btn">
                <span>Create Account</span>
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            </div>
          </form>

          <div
            className="reg-fu reg-fu-4"
            style={{ marginTop: 24, textAlign: "center" }}
          >
            <p style={{ fontSize: 14, color: "#9ca3af", fontWeight: 300 }}>
              Already have an account?{" "}
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
        @media (min-width: 1024px) { .reg-mobile-badge { display: none !important; } }
        @media (max-width: 1023px) { .reg-mobile-badge { display: block !important; } }
      `}</style>
    </div>
  );
}

export default Register;
