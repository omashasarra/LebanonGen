const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const coupleRoutes = require("./routes/CouplesRoute");
const groqRoutes = require("./routes/groq");
const adminRoutes = require("./routes/adminRoutes");
const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://lebanon-gen.vercel.app",  // replace with your actual Vercel URL
    ],
    credentials: true,
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// 1. Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

db.connect((err) => {
  if (err) {
    console.error("❌ DATABASE CONNECTION FAILED:", err.message);
    process.exit(1); // Stop the script if DB is not running
  }
  console.log("✅ Connected to the MySQL database.");
});

app.use("/api", coupleRoutes(db));
app.use("/api/ai", groqRoutes(db));
app.use("/api/admin", adminRoutes(db));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SERVER IS LIVE AT: http://0.0.0.0:${PORT}`);
});
