import React, { useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import "../styles/main.css";

function CoupleForm() {
  // Retrieve the ID saved during login
  const coupleID = localStorage.getItem("coupleID");

  const [formData, setFormData] = useState({
    // Husband Data
    husbandFullName: "",
    husbandDOB: "",
    husbandRegion: "",
    husbandbloodtype: "",
    husbandrhfactor: "",
    husbandgenotype: "",
    HusbandfamilyHistory: "",

    // Wife Data
    wifeFullName: "",
    wifeDOB: "",
    wifeRegion: "",
    wifebloodtype: "",
    wiferhfactor: "",
    wifegenotype: "",
    WifefamilyHistory: "",
    affected: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation Logic
    // Check if any value in formData is an empty string
    const missingFields = Object.keys(formData).filter(
      (key) => formData[key] === "",
    );

    if (missingFields.length > 0) {
      alert("Please fill in all fields before submitting.");
      return; // Stop the function here
    }

    // Ensure coupleID exists (user is logged in)
    if (!coupleID) {
      alert("Session expired. Please log in again.");
      return;
    }

    // 2. Data Preparation (Only runs if validation passes)
    const persons = [
      {
        coupleID: coupleID,
        fullName: formData.husbandFullName,
        role: "Husband",
        dob: formData.husbandDOB,
        gender: "Male",
        region: formData.husbandRegion,
        bloodType: formData.husbandbloodtype,
        rhFactor: formData.husbandrhfactor,
        genotype: formData.husbandgenotype,
        familyHistory: formData.HusbandfamilyHistory,
        hasAffectedChild: formData.affected.toLowerCase() === "yes" ? 1 : 0,
      },
      {
        coupleID: coupleID,
        fullName: formData.wifeFullName,
        role: "Wife",
        dob: formData.wifeDOB,
        gender: "Female",
        region: formData.wifeRegion,
        bloodType: formData.wifebloodtype,
        rhFactor: formData.wiferhfactor,
        genotype: formData.wifegenotype,
        familyHistory: formData.WifefamilyHistory,
        hasAffectedChild: formData.affected.toLowerCase() === "yes" ? 1 : 0,
      },
    ];

    try {
      const response = await axios.post(
        "http://localhost:5000/api/save-couple-data",
        {
          coupleId: coupleID,
          persons: persons,
        },
      );

      if (response.status === 200) {
        alert("Assessment submitted successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please check your connection.");
    }
  };

  return (
    <div>
      <div className="form-wrapper">
        <div className="form-card" style={{ maxWidth: "800px" }}>
          <h2 style={{ color: "#b30000" }}>Couple Genetic Compatibility</h2>
          <p className="form-subtitle">
            Analyze the probability of passing sickle cell disease to children.
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            {/* Husband Section */}
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

            <input
              type="text"
              name="husbandgenotype"
              placeholder="Husband's Genotype (AA, AS, SS)"
              onChange={handleChange}
            />
            <input
              type="text"
              name="wifegenotype"
              placeholder="Wife's Genotype (AA, AS, SS)"
              onChange={handleChange}
            />

            <textarea
              name="HusbandfamilyHistory"
              placeholder="Is any member of the husband’s family affected"
              onChange={handleChange}
            />
            <textarea
              name="WifefamilyHistory"
              placeholder="Is any member of the wife’s family affected"
              onChange={handleChange}
            />

            <textarea
              type="text"
              name="affected"
              placeholder="Do you have affected child? (Yes/No)"
              onChange={handleChange}
            />

            <button
              type="submit"
              className="submit-btn"
              style={{ gridColumn: "span 2" }}
            >
              Submit Form
            </button>
            <div className="form-footer">
              <p>
                Get Ai help?
                <a href="/chatbot" className="register-link">
                  {" "}
                  Click Here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoupleForm;
