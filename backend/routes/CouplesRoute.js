const express = require("express");
const router = express.Router();
const axios = require("axios");
const bcrypt = require("bcrypt");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

function getBaseProbability(genotypeA, genotypeB) {
  const pair = [genotypeA, genotypeB].sort().join("+");
  const probabilities = {
    "AA+AA": 0.0,
    "AA+AS": 0.0,
    "AA+SS": 0.0,
    "AS+AS": 0.25,
    "AS+SS": 0.5,
    "SS+SS": 1.0,
  };
  return probabilities[pair] ?? 0.0;
}

module.exports = (db) => {
  // 1. LOGIN (bcrypt secure)
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM couple WHERE Email = ?";

    db.execute(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      try {
        const match = await bcrypt.compare(password, user.Password);
        if (match) {
          return res.status(200).json({
            message: "Login successful",
            user: { id: user.CoupleID, email: user.Email },
          });
        } else {
          return res.status(401).json({ message: "Invalid email or password" });
        }
      } catch (bcryptErr) {
        console.error("Login verification error:", bcryptErr);
        return res.status(500).json({ error: "Internal validation failure" });
      }
    });
  });

  // 2. REGISTER (bcrypt secure)
  router.post("/register", (req, res) => {
    const { email, password } = req.body;
    const checkUser = "SELECT * FROM couple WHERE Email = ?";

    db.execute(checkUser, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0)
        return res.status(400).json({ message: "Email already registered" });

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO couple (Email, Password) VALUES (?, ?)";
        db.execute(query, [email, hashedPassword], (insertErr) => {
          if (insertErr)
            return res.status(500).json({ error: "Database error" });
          return res
            .status(201)
            .json({ message: "User registered successfully" });
        });
      } catch (hashErr) {
        console.error("Registration hashing error:", hashErr);
        return res
          .status(500)
          .json({ error: "Failed to securely process registration" });
      }
    });
  });

  // 3. SAVE DATA & CALCULATE ASSESSMENT USING ML FLASK SERVICE
  router.post("/save-couple-data", (req, res) => {
    const { coupleId, persons } = req.body;

    if (!persons || persons.length < 2) {
      return res.status(400).json({
        message: "Incomplete couple data provided. Both partners required.",
      });
    }

    const personQuery = `
      INSERT INTO person 
      (CoupleID, Role, FullName, Gender, Genotype, BloodType, RhFactor, DateOfBirth, RegionID, FamilyHistory, HasAffectedChild) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      FullName = VALUES(FullName),
      Gender = VALUES(Gender),
      Genotype = VALUES(Genotype),
      BloodType = VALUES(BloodType),
      RhFactor = VALUES(RhFactor),
      DateOfBirth = VALUES(DateOfBirth),
      RegionID = VALUES(RegionID),
      FamilyHistory = VALUES(FamilyHistory),
      HasAffectedChild = VALUES(HasAffectedChild)
    `;

    const husband = persons.find((p) => p.role === "Husband");
    const wife = persons.find((p) => p.role === "Wife");

    // 1. Save Husband first
    db.execute(
      personQuery,
      [
        coupleId,
        husband.role,
        husband.fullName,
        husband.gender,
        husband.genotype,
        husband.bloodType,
        husband.rhFactor,
        husband.dob,
        husband.region,
        husband.familyHistory,
        husband.hasAffectedChild,
      ],
      (err1) => {
        if (err1) {
          console.error("Error saving husband profile:", err1);
          return res
            .status(500)
            .json({ error: "Failed to save partner records." });
        }

        // 2. Save Wife
        db.execute(
          personQuery,
          [
            coupleId,
            wife.role,
            wife.fullName,
            wife.gender,
            wife.genotype,
            wife.bloodType,
            wife.rhFactor,
            wife.dob,
            wife.region,
            wife.familyHistory,
            wife.hasAffectedChild,
          ],
          (err2) => {
            if (err2) {
              console.error("Error saving wife profile:", err2);
              return res
                .status(500)
                .json({ error: "Failed to save partner records." });
            }

            // 3. Call Flask ML model
            const normalizeGenotype = (g) =>
              g?.toUpperCase().split("").sort().join("");

            const mlPayload = {
              base_probability: getBaseProbability(
                normalizeGenotype(husband.genotype),
                normalizeGenotype(wife.genotype),
              ),
              husband_familyHistory: husband.familyHistory ? 1 : 0,
              wife_familyHistory: wife.familyHistory ? 1 : 0,
              husband_hasAffectedChild: husband.hasAffectedChild ? 1 : 0,
              wife_hasAffectedChild: wife.hasAffectedChild ? 1 : 0,
            };

            axios
              .post(`${ML_SERVICE_URL}/predict`, mlPayload)
              .then((mlResponse) => {
                const probability = mlResponse.data.probability * 100 || 0.0;

                let riskLevel = "Low Risk";
                let recommendation =
                  "Genetically compatible for Sickle Cell Anemia. No abnormal risks detected.";

                if (probability >= 75.0) {
                  riskLevel = "Critical";
                  recommendation = `${probability.toFixed(1)}% chance of inheritance detected. High operational risk.`;
                } else if (probability >= 45.0) {
                  riskLevel = "Very High Risk";
                  recommendation = `${probability.toFixed(1)}% chance of offspring inheriting Sickle Cell Anemia (SS). Seek medical advice.`;
                } else if (probability >= 20.0) {
                  riskLevel = "High Risk";
                  recommendation = `${probability.toFixed(1)}% chance of offspring inheriting Sickle Cell Anemia (SS). Genetic counseling recommended.`;
                } else if (probability >= 5.0) {
                  // Only trigger carrier warning if there's an actual structural carrier presence (like AS traits)
                  riskLevel = "Carrier Risk";
                  recommendation =
                    "Low direct disease risk, but offspring may be potential carriers.";
                }

                const assessmentQuery = `
                  INSERT INTO assessment (CoupleID, Probability, RiskLevel, Recommendation, CreatedAt)
                  VALUES (?, ?, ?, ?, NOW())
                `;

                db.execute(
                  assessmentQuery,
                  [coupleId, probability, riskLevel, recommendation],
                  (assessErr) => {
                    if (assessErr) {
                      console.error("Assessment Save Error:", assessErr);
                      return res.status(500).json({
                        error: "Data saved, but assessment log entry failed.",
                      });
                    }

                    return res.status(200).json({
                      message:
                        "Data saved and ML assessment generated successfully!",
                      assessment: { probability, riskLevel, recommendation },
                    });
                  },
                );
              })
              .catch((mlError) => {
                console.error(
                  "Failed to fetch prediction from ML Service:",
                  mlError.message,
                );
                return res.status(500).json({
                  error:
                    "Could not connect to the Machine Learning model service.",
                });
              });
          },
        );
      },
    );
  });

  // 4. GET EXISTING ASSESSMENT FOR A COUPLE (locks the form on re-login)
  router.get("/couple-assessment/:coupleId", (req, res) => {
    const { coupleId } = req.params;

    const sql = `
      SELECT 
        a.Probability, a.RiskLevel, a.Recommendation, a.CreatedAt,
        p.Role, p.FullName, p.Genotype, p.BloodType, p.RhFactor,
        p.DateOfBirth, p.FamilyHistory, p.HasAffectedChild,
        r.Name as Region
      FROM assessment a
      JOIN couple c ON a.CoupleID = c.CoupleID
      LEFT JOIN person p ON p.CoupleID = c.CoupleID
      LEFT JOIN region r ON p.RegionID = r.RegionID
      WHERE a.CoupleID = ?
      ORDER BY a.CreatedAt DESC
    `;

    db.execute(sql, [coupleId], (err, results) => {
      if (err) {
        console.error("Error fetching assessment:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No assessment found" });
      }

      const first = results[0];
      const data = {
        assessment: {
          probability: first.Probability,
          riskLevel: first.RiskLevel,
          recommendation: first.Recommendation,
          createdAt: first.CreatedAt,
        },
        husband: null,
        wife: null,
      };

      results.forEach((row) => {
        if (row.Role === "Husband") {
          data.husband = {
            fullName: row.FullName,
            genotype: row.Genotype,
            bloodType: row.BloodType,
            rhFactor: row.RhFactor,
            dateOfBirth: row.DateOfBirth,
            familyHistory: row.FamilyHistory,
            hasAffectedChild: row.HasAffectedChild,
            region: row.Region,
          };
        } else if (row.Role === "Wife") {
          data.wife = {
            fullName: row.FullName,
            genotype: row.Genotype,
            bloodType: row.BloodType,
            rhFactor: row.RhFactor,
            dateOfBirth: row.DateOfBirth,
            familyHistory: row.FamilyHistory,
            hasAffectedChild: row.HasAffectedChild,
            region: row.Region,
          };
        }
      });

      return res.status(200).json(data);
    });
  });


  // 6. RESET PASSWORD (bcrypt secure)
  router.post("/reset-password", (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const checkQuery = "SELECT * FROM couple WHERE Email = ?";

    db.execute(checkQuery, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      try {
        const match = await bcrypt.compare(oldPassword, results[0].Password);
        if (!match) {
          return res.status(401).json({ message: "Invalid old password" });
        }

        const hashedNew = await bcrypt.hash(newPassword, 10);
        const updateQuery = "UPDATE couple SET Password = ? WHERE Email = ?";

        db.execute(updateQuery, [hashedNew, email], (updateErr) => {
          if (updateErr)
            return res.status(500).json({ message: "Update failed" });
          return res
            .status(200)
            .json({ message: "Password updated successfully" });
        });
      } catch (bcryptErr) {
        console.error("Password reset error:", bcryptErr);
        return res.status(500).json({ message: "Internal error" });
      }
    });
  });

  return router;
};
