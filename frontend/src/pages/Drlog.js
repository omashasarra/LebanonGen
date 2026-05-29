import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/main.css";

function Drlog() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/doctor-login`,
        formData,
      );

      if (response.status === 200) {
        localStorage.setItem("drToken", response.data.token);
        localStorage.setItem("drRole", response.data.role);
        localStorage.setItem("drName", response.data.name);
        localStorage.setItem("drEmail", formData.email);

        alert(`Access Granted. Welcome, ${response.data.name}`);

        // Route based on the role provided by the database
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
    <div className="page-container">
      <div className="form-wrapper" style={{ padding: "80px 20px" }}>
        <div
          className="form-card"
          style={{
            maxWidth: "450px",
            borderTop: "5px solid #b30000",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ color: "#b30000", marginBottom: "10px" }}>
              LebanonGen
            </h2>
            <h4 style={{ color: "#555", fontWeight: "400" }}>
              Medical Staff Portal
            </h4>
            <div
              style={{
                height: "2px",
                width: "50px",
                background: "#eee",
                margin: "15px auto",
              }}
            ></div>
          </div>

          <p
            className="form-subtitle"
            style={{ textAlign: "center", fontSize: "0.9rem" }}
          >
            Authorized Personnel Only: Enter your professional credentials to
            access genetic analytics and regional health data.
          </p>

          <form
            className="form-grid"
            onSubmit={handleSubmit}
            style={{ marginTop: "25px" }}
          >

            <input
              type="email"
              name="email"
              placeholder="Professional Email"
              onChange={handleChange}
              required
              style={{ gridColumn: "span 2" }}
            />

            <input
              type="password"
              name="password"
              placeholder="Security Password"
              onChange={handleChange}
              required
              style={{ gridColumn: "span 2" }}
            />

            <button
              type="submit"
              className="submit-btn"
              style={{
                gridColumn: "span 2",
                backgroundColor: "#b30000",
                marginTop: "10px",
                padding: "15px",
              }}
            >
              Authenticate & Enter
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <a
              href="/help"
              style={{
                fontSize: "0.8rem",
                color: "#999",
                textDecoration: "none",
              }}
            >
              Forgot credentials? Contact System Admin
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Drlog;
