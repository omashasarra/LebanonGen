const express = require("express");
const router = express.Router();
const axios = require("axios");

module.exports = (db) => {
  // 1. AI CHATBOT ROUTE
  router.post("/ai-chat", async (req, res) => {
    const { coupleId, message } = req.body;

    if (!coupleId)
      return res.status(400).json({ reply: "Please log in first." });

    const sql = "SELECT Role, Genotype FROM person WHERE CoupleID = ?";

    db.execute(sql, [coupleId], async (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ reply: "Database error." });
      }

      const context = results.length
        ? results.map((r) => `${r.Role} Genotype: ${r.Genotype}`).join(", ")
        : "No genetic data provided yet for this couple.";

      try {
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are a professional genetic counselor for LebanonGen.
                
                PATIENT CONTEXT: ${context}. 

                STRICT RESPONSE GUIDELINES:
                1. Use Bullet Points for all risks and recommendations.
                2. Use **Bold Text** for genotypes and percentages.
                3. Organize with Markdown headers.
                4. ALWAYS end with a medical disclaimer.`,
              },
              { role: "user", content: message },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        const aiReply = response.data.choices[0].message.content;

        // --- NEW: SAVE TO ASSESSMENT TABLE ---
        // We determine a simple risk level based on the AI's context for the database
        const riskLevel =
          aiReply.includes("100%") || aiReply.includes("SS")
            ? "High Risk"
            : "Moderate/Low Risk";

        const saveSql = `
          INSERT INTO assessment (CoupleID, RiskLevel, Recommendation, CreatedAt) 
          VALUES (?, ?, ?, NOW())
        `;

        db.execute(saveSql, [coupleId, riskLevel, aiReply], (saveErr) => {
          if (saveErr) {
            console.error("Failed to save assessment:", saveErr);
            // We still return the reply to the user even if saving fails
          }
          console.log("✅ Assessment results saved to database.");
        });
        // -------------------------------------

        return res.status(200).json({ reply: aiReply });
      } catch (error) {
        console.error("GROQ AI ERROR:", error.response?.data || error.message);
        return res.status(500).json({
          reply: "The AI is currently unavailable. Please try again later.",
        });
      }
    });
  });

  // 2. LOGIN 
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM couple WHERE Email = ? AND Password = ?";

    db.execute(query, [email, password], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) {
        return res.status(200).json({
          message: "Login successful",
          user: { id: results[0].CoupleID, email: results[0].Email },
        });
      }
      return res.status(401).json({ message: "Invalid email or password" });
    });
  });

  // 3. REGISTER 
  router.post("/register", (req, res) => {
    const { email, password } = req.body;
    const checkUser = "SELECT * FROM couple WHERE Email = ?";

    db.execute(checkUser, [email], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0)
        return res.status(400).json({ message: "Email already registered" });

      const query = "INSERT INTO couple (Email, Password) VALUES (?, ?)";
      db.execute(query, [email, password], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        return res
          .status(201)
          .json({ message: "User registered successfully" });
      });
    });
  });

  //  4. SAVE DATA & CALCULATE ASSESSMENT
  router.post("/save-couple-data", (req, res) => {
    const { coupleId, persons } = req.body;

    // First Query: Save or Update person data in the 'person' table
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

    let completed = 0;
    if (!persons || persons.length === 0)
      return res.status(400).json({ message: "No data to save" });

    persons.forEach((person) => {
      db.execute(
      personQuery,
      [
        coupleId,
        person.role,
        person.fullName,
        person.gender,      
        person.genotype,
        person.bloodType,
        person.rhFactor,
        person.dob,
        person.region,
        person.familyHistory,
        person.hasAffectedChild
      ],
        (err) => {
          if (err) console.error("Error saving person:", err);
          completed++;

          // Once both Husband and Wife records are saved, calculate the assessment
          if (completed === persons.length) {
            
            // --- CALCULATION LOGIC FOR SICKLE CELL ANEMIA ---
            const husbandG = persons.find((p) => p.role === "Husband").genotype.toUpperCase();
            const wifeG = persons.find((p) => p.role === "Wife").genotype.toUpperCase();

            let probability = 0.0;
            let riskLevel = "Low Risk";
            let recommendation = "Genetically compatible for Sickle Cell Anemia.";

            // Logic based on standard Punnett square results
            if (husbandG === "AS" && wifeG === "AS") {
              probability = 25.0;
              riskLevel = "High Risk";
              recommendation = "25% chance of offspring having Sickle Cell Anemia (SS). Genetic counseling recommended.";
            } else if ((husbandG === "AS" && wifeG === "SS") || (husbandG === "SS" && wifeG === "AS")) {
              probability = 50.0;
              riskLevel = "Very High Risk";
              recommendation = "50% chance of offspring having Sickle Cell Anemia (SS). Seek medical advice.";
            } else if (husbandG === "SS" && wifeG === "SS") {
              probability = 100.0;
              riskLevel = "Critical";
              recommendation = "100% chance of offspring having Sickle Cell Anemia (SS). High risk of inheritance.";
            } else if (husbandG === "AA" && (wifeG === "AS" || wifeG === "SS") || wifeG === "AA" && (husbandG === "AS" || husbandG === "SS")) {
              probability = 0.0;
              riskLevel = "Carrier Risk";
              recommendation = "No risk of SS disease in children, but offspring may be carriers (AS).";
            }

            // Second Query: Save the final result into the 'assessment' table
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
                  return res.status(500).json({ error: "Data saved, but assessment entry failed." });
                }
                return res.status(200).json({
                  message: "Data saved and assessment generated successfully!",
                  assessment: { probability, riskLevel, recommendation }
                });
              }
            );
          }
        }
      );
    });
  });

   // 5. API to get region status stats for dashboard
  router.get("/region-status-stats", (req, res) => {
    const query = `
      SELECT 
        r.Name as region,
        r.RegionID,
        COUNT(CASE WHEN p.Genotype = 'AS' THEN 1 END) as carriers,
        COUNT(CASE WHEN p.Genotype = 'SS' THEN 1 END) as infected
      FROM region r
      LEFT JOIN person p ON r.RegionID = p.RegionID
      GROUP BY r.RegionID, r.Name
      ORDER BY r.RegionID
    `;
    
    db.execute(query, (error, results) => {
      if (error) {
        console.error("Error fetching region stats:", error);
        return res.status(500).json({ error: "Database error: " + error.message });
      }
      
      console.log("Region stats results:", results);
      res.json(results);
    });
  });

  router.post("/reset-password", (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const checkQuery =
    "SELECT * FROM couple WHERE Email = ? AND Password = ?";

  db.execute(
    checkQuery,
    [email, oldPassword],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid old password",
        });
      }

      const updateQuery =
        "UPDATE couple SET Password = ? WHERE Email = ?";

      db.execute(
        updateQuery,
        [newPassword, email],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              message: "Update failed",
            });
          }

          return res.status(200).json({
            message: "Password updated successfully",
          });
        }
      );
    }
  );
});

  return router;
};
