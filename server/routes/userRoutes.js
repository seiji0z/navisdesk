import express from "express";
import AdminOsas from "../models/AdminOsas.js";
import StudentOrg from "../models/StudentOrg.js";

const router = express.Router();

router.get("/users", async (req, res) => {
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
    console.error("GET /api/users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;