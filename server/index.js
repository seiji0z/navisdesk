import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import AdminOsas from "./models/AdminOsas.js";
import StudentOrg from "./models/StudentOrg.js";

dotenv.config();
const app = express();

app.use(cors());           // Allow file:// and localhost
app.use(express.json());

// ========== API: GET ALL USERS ==========
app.get("/api/users", async (req, res) => {
  console.log("API HIT: GET /api/users");
  try {
    const [admins, orgs] = await Promise.all([
      AdminOsas.find().lean(),
      StudentOrg.find().lean(),
    ]);

    console.log(`Found: ${admins.length} admins, ${orgs.length} orgs`);

    const formattedAdmins = admins.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role === "admin" ? "Admin" : "OSAS Officer",
      status: u.status || "Active",
      dateRegistered: u.created_at
        ? new Date(u.created_at).toLocaleDateString("en-GB")
        : "N/A",
      lastLogin: u.last_log
        ? new Date(u.last_log).toLocaleDateString("en-GB")
        : "N/A",
    }));

    const formattedOrgs = orgs.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: "Student Org",
      status: u.status || "Active",
      dateRegistered: u.created_at
        ? new Date(u.created_at).toLocaleDateString("en-GB")
        : "N/A",
      lastLogin: u.last_log
        ? new Date(u.last_log).toLocaleDateString("en-GB")
        : "N/A",
      abbreviation: u.abbreviation || "",
      department: u.department || "",
      type: u.type || "",
      adviserName: u.adviser?.name || "",
      adviserEmail: u.adviser?.email || "",
      description: u.description || "",
      fb: u.fb_link || "",
      ig: u.ig_link || "",
      website: u.website_link || "",
    }));

    res.json([...formattedAdmins, ...formattedOrgs]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ========== START SERVER ==========
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`API Server: http://localhost:${PORT}/api/users`);
    });
  })
  .catch(err => {
    console.error("DB Error:", err);
    process.exit(1);
  });