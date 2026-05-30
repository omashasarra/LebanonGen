  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import "../styles/login.css";

  function Login() {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();

      if (response.ok) {
          // SAVE the ID to localStorage so the form can find it
          localStorage.setItem("coupleId", data.user.id);   
          navigate("/form"); 
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Connection error", error);
        alert("Server error. Please try again later.");
      }
    };

    return (
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Patient Portal Login</h2>
          <p className="form-subtitle">
            Register your profile to help us track and prevent sickle cell disease across Lebanon.
          </p>

          <form className="login-form-fields" onSubmit={handleSubmit}>
            {/* This field now acts as the Email/ID field to maintain your layout */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <button type="submit" className="calculate-btn">
              Sign In
            </button>
          </form>

          <div className="form-footer">
            <p>Don't have an account? 
              <a href="/register" className="register-link"> Register here</a>
            </p>
            <div style={{ textAlign: "center" }}>
            <a
              href="mailto:samer.fares@lebanongen.com"
              style={{
                fontSize: "0.85rem",
                color: "#666565",
                textDecoration: "none",
              }}
            >
              Forgot credentials? Contact System Admin
            </a>
          </div>
            <p>
              <a href="/reset" className="register-link"> Reset Password</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  export default Login;