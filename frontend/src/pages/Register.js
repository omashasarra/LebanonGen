import React, { useState } from "react";
import "../styles/login.css"; 

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
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

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Patient Registration</h2>
        <p className="form-subtitle">
          Create your account to start your genetic compatibility assessment.
        </p>

        <form className="login-form-fields" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="calculate-btn">
            Register
          </button>
        </form>
        
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          Already have an account? <a href="/login" style={{ color: '#b30000', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default Register;