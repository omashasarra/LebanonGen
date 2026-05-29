import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Reset() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          }),
        }
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

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Reset Password</h2>

        <p className="form-subtitle">
          Enter your current password and choose a new one.
        </p>

        <form
          className="login-form-fields"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="calculate-btn">
            Reset Password
          </button>
        </form>

        <div className="form-footer">
          <p>
            Back to
            <a href="/" className="register-link">
              {" "}
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Reset;