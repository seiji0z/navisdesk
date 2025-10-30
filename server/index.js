import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import AdminOsas from "./models/AdminOsas.js";
import StudentOrg from "./models/StudentOrg.js";
import UserLog from "./models/UserLog.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ========== API: GET ALL USERS (FOR USER MANAGEMENT) ==========
app.get("/api/users", async (req, res) => {
  try {
    const [admins, orgs] = await Promise.all([
      AdminOsas.find().lean(),
      StudentOrg.find().lean(),
    ]);

    const formattedAdmins = admins.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role === "admin" ? "Admin" : "OSAS Officer",
      status: u.status || "Active",
      dateRegistered: u.created_at ? new Date(u.created_at).toLocaleDateString("en-GB") : "N/A",
      lastLogin: u.last_log ? new Date(u.last_log).toLocaleDateString("en-GB") : "N/A",
    }));

    const formattedOrgs = orgs.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: "Student Org",
      status: u.status || "Active",
      dateRegistered: u.created_at ? new Date(u.created_at).toLocaleDateString("en-GB") : "N/A",
      lastLogin: u.last_log ? new Date(u.last_log).toLocaleDateString("en-GB") : "N/A",
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
    console.error("API /users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ========== API: GET ACTIVITY LOGS (WITH STRING IDs) ==========
app.get("/api/activity-logs", async (req, res) => {
  try {
    const logs = await UserLog.find().sort({ timestamp: -1 }).lean();
    const formatted = logs.map(log => ({
      _id: log._id.toString(),
      user_id: log.user_id.toString(),  // Critical: string for frontend
      role: log.role,
      action: log.action,
      timestamp: log.timestamp
    }));
    res.json(formatted);
  } catch (err) {
    console.error("API /activity-logs error:", err);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// ========== API: GET ADMINS (NAME + ID) ==========
app.get("/api/admins", async (req, res) => {
  try {
    const admins = await AdminOsas.find({}, { _id: 1, name: 1 }).lean();
    const formatted = admins.map(a => ({
      _id: a._id.toString(),  // String for lookup
      name: a.name
    }));
    res.json(formatted);
  } catch (err) {
    console.error("API /admins error:", err);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

// ========== API: GET STUDENT ORGS (NAME + ID) ==========
app.get("/api/student-orgs", async (req, res) => {
  try {
    const orgs = await StudentOrg.find({}, { _id: 1, name: 1 }).lean();
    const formatted = orgs.map(o => ({
      _id: o._id.toString(),  // String for lookup
      name: o.name
    }));
    res.json(formatted);
  } catch (err) {
    console.error("API /student-orgs error:", err);
    res.status(500).json({ error: "Failed to fetch student orgs" });
  }
});

// ========== START SERVER ==========
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`API Server running at http://localhost:${PORT}`);
      console.log(`   → GET /api/users`);
      console.log(`   → GET /api/activity-logs`);
      console.log(`   → GET /api/admins`);
      console.log(`   → GET /api/student-orgs`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });