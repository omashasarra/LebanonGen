// adminRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  router.post("/doctor-login", (req, res) => {
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Received body:", req.body);

    const { email, password } = req.body;

    // Check if fields exist
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Email and password required" });
    }

    // First, let's see all doctors in the database
    db.query(
      "SELECT Email, Password, Role, Name FROM doctor",
      (err, allDoctors) => {
        if (err) {
          console.error("Error fetching doctors:", err);
        } else {
          console.log("All doctors in DB:", allDoctors);
        }
      },
    );

    // Now try to find the specific user
    const sql = "SELECT * FROM doctor WHERE Email = ?";

    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }

      console.log(`Found ${results.length} user(s) with email: ${email}`);

      if (results.length === 0) {
        console.log(`No user found with email: "${email}"`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];
      console.log("User found:", {
        id: user.DoctorID,
        name: user.Name,
        email: user.Email,
        dbPassword: user.Password,
        providedPassword: password,
        role: user.Role,
      });

      try {
        // Compare the provided plain-text password with the stored bcrypt hash
        const match = await bcrypt.compare(password, user.Password);

        if (match) {
          console.log("✅ Password match successful!");
          return res.json({
            token: "session_id_123",
            role: user.Role,
            name: user.Name,
          });
        } else {
          console.log(`❌ Password mismatch.`);
          return res.status(401).json({ message: "Invalid credentials" });
        }
      } catch (bcryptErr) {
        console.error("Login verification error:", bcryptErr);
        return res.status(500).json({ error: "Internal validation failure" });
      }
    });
  });

  // 2. SHARED: Regional Analytics (For Researchers & Admins)
  router.get("/region-stats", (req, res) => {
    const sql = `
      SELECT r.Name AS region, 
      SUM(CASE WHEN p.Genotype = 'AS' THEN 1 ELSE 0 END) as carriers,
      SUM(CASE WHEN p.Genotype = 'SS' THEN 1 ELSE 0 END) as infected
      FROM region r
      LEFT JOIN person p ON r.RegionID = p.RegionID
      GROUP BY r.RegionID, r.Name`;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  // 3. CONSULTANT: Review assessments
  router.get("/assessments", (req, res) => {
    const sql = `
      SELECT a.*, c.Email 
      FROM assessment a 
      JOIN couple c ON a.CoupleID = c.CoupleID 
      ORDER BY a.CreatedAt DESC`;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  // 4. ADMIN: Oversight of doctors and couples
  router.get("/users-overview", (req, res) => {
    const sql = `
      SELECT 'doctor' as type, Name, Email, Role FROM doctor
      UNION
      SELECT 'couple' as type, NULL as Name, Email, NULL as Role FROM couple`;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  // 5. ADMIN PASSWORD RESET ENDPOINT (bcrypt secure)
  router.post("/reset-password", async (req, res) => {
    const { email, userType, userName } = req.body;

    let newPassword;
    let tableName;

    if (userType === "couple") {
      // For couples: password = their email string
      newPassword = email;
      tableName = "couple";
    } else if (userType === "staff") {
      // For staff: generate a random temporary password string
      const generateTempPassword = () => {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        let password = "";
        for (let i = 0; i < 10; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      };
      newPassword = generateTempPassword();
      tableName = "doctor";
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    try {
      // Encrypt the new plaintext password before database execution
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const sql = `UPDATE ${tableName} SET Password = ? WHERE Email = ?`;

      db.query(sql, [hashedPassword, email], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        // Return plain text version back to frontend exclusively for visualization alerts
        return res.json({
          message: "Password reset successful",
          newPassword: newPassword,
          userType: userType,
        });
      });
    } catch (hashErr) {
      console.error("Password reset hashing error:", hashErr);
      return res
        .status(500)
        .json({ error: "Failed to securely process password reset" });
    }
  });

  // 6. Delete staff only (not couples)
  router.delete("/delete-staff/:email", (req, res) => {
    const { email } = req.params;

    // Only delete from doctor table, not from couple table
    const sql = "DELETE FROM doctor WHERE Email = ?";

    db.query(sql, [email], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Staff member not found" });
      }

      return res.json({ message: "Staff member deleted successfully" });
    });
  });

  // 7. GENETIC RESEARCHER: Get region statistics based on actual genotypes (AA, AS, SS)
  router.get("/genetic-region-stats", (req, res) => {
    const sql = `
      SELECT 
        r.Name,
        r.RegionID,
        COUNT(CASE WHEN p.Genotype = 'AA' THEN 1 END) as normal,
        COUNT(CASE WHEN p.Genotype = 'AS' THEN 1 END) as carriers,
        COUNT(CASE WHEN p.Genotype = 'SS' THEN 1 END) as infected,
        COUNT(p.PersonID) as total_individuals
      FROM region r
      LEFT JOIN person p ON r.RegionID = p.RegionID
      GROUP BY r.RegionID, r.Name
      ORDER BY r.Name
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }

      // Calculate percentages and add risk level
      const enhancedResults = results.map((region) => ({
        ...region,
        carrier_percentage:
          region.total_individuals > 0
            ? ((region.carriers / region.total_individuals) * 100).toFixed(1)
            : 0,
        infected_percentage:
          region.total_individuals > 0
            ? ((region.infected / region.total_individuals) * 100).toFixed(1)
            : 0,
        normal_percentage:
          region.total_individuals > 0
            ? ((region.normal / region.total_individuals) * 100).toFixed(1)
            : 0,
        risk_level:
          region.total_individuals > 0
            ? region.infected / region.total_individuals >= 0.5
              ? "HIGH RISK"
              : region.infected / region.total_individuals >= 0.25
                ? "MODERATE RISK"
                : region.infected / region.total_individuals >= 0.1
                  ? "ELEVATED RISK"
                  : "LOW RISK"
            : "NO DATA",
      }));

      return res.json(enhancedResults);
    });
  });

  // 8. GENETIC RESEARCHER: Get overall statistics for dashboard
  router.get("/genetic-overall-stats", (req, res) => {
    const sql = `
      SELECT 
        COUNT(CASE WHEN Genotype = 'AA' THEN 1 END) as total_normal,
        COUNT(CASE WHEN Genotype = 'AS' THEN 1 END) as total_carriers,
        COUNT(CASE WHEN Genotype = 'SS' THEN 1 END) as total_infected,
        COUNT(*) as total_individuals
      FROM person
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
      return res.json(results[0]);
    });
  });

  // 9. GENETIC RESEARCHER: Get detailed region data with individuals
  router.get("/genetic-region-details/:regionId", (req, res) => {
    const { regionId } = req.params;

    const sql = `
      SELECT 
        p.PersonID,
        p.FullName,
        p.Gender,
        p.Genotype,
        p.BloodType,
        p.RhFactor,
        p.Role,
        c.Email as couple_email
      FROM person p
      JOIN couple c ON p.CoupleID = c.CoupleID
      WHERE p.RegionID = ?
      ORDER BY p.Genotype, p.FullName
    `;

    db.query(sql, [regionId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
      return res.json(results);
    });
  });

  // 10. Get couple details with all persons (husband and wife)
  router.get("/couple-details/:email", (req, res) => {
    const { email } = req.params;

    const sql = `
      SELECT 
        c.CoupleID,
        c.Email,
        c.CreatedAt,
        p.PersonID,
        p.FullName,
        p.Gender,
        p.Role,
        p.DateOfBirth,
        p.BloodType,
        p.RhFactor,
        p.Genotype,
        p.FamilyHistory,
        p.HasAffectedChild,
        r.Name as Region,
        a.Probability,
        a.RiskLevel,
        a.Recommendation,
        a.CreatedAt as AssessmentDate
      FROM couple c
      LEFT JOIN person p ON c.CoupleID = p.CoupleID
      LEFT JOIN region r ON p.RegionID = r.RegionID
      LEFT JOIN assessment a ON c.CoupleID = a.CoupleID
      WHERE c.Email = ?
      ORDER BY p.Role DESC
    `;

    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Couple not found" });
      }

      // Organize data
      const coupleData = {
        coupleId: results[0].CoupleID,
        email: results[0].Email,
        registeredAt: results[0].CreatedAt,
        assessmentDate: results[0].AssessmentDate,
        probability: results[0].Probability,
        riskLevel: results[0].RiskLevel,
        recommendation: results[0].Recommendation,
        husband: null,
        wife: null,
      };

      // Separate husband and wife
      results.forEach((row) => {
        if (row.Role === "Husband") {
          coupleData.husband = {
            personId: row.PersonID,
            fullName: row.FullName,
            gender: row.Gender,
            dateOfBirth: row.DateOfBirth,
            bloodType: row.BloodType,
            rhFactor: row.RhFactor,
            genotype: row.Genotype,
            familyHistory: row.FamilyHistory,
            hasAffectedChild: row.HasAffectedChild,
            region: row.Region,
          };
        } else if (row.Role === "Wife") {
          coupleData.wife = {
            personId: row.PersonID,
            fullName: row.FullName,
            gender: row.Gender,
            dateOfBirth: row.DateOfBirth,
            bloodType: row.BloodType,
            rhFactor: row.RhFactor,
            genotype: row.Genotype,
            familyHistory: row.FamilyHistory,
            hasAffectedChild: row.HasAffectedChild,
            region: row.Region,
          };
        }
      });

      return res.json(coupleData);
    });
  });

  return router;
};
