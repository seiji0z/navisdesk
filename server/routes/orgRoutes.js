import express from "express";
import StudentOrg from "../models/StudentOrg.js";

const router = express.Router();

// GET: Current org profile
router.get("/orgs/me", async (req, res) => {
  try {
    const orgId = req.headers["x-org-id"] || "6716001a9b8c2001abcd0001";
    const org = await StudentOrg.findById(orgId).lean();
    if (!org) return res.status(404).json({ message: "Org not found" });
    res.json(org);
  } catch (err) {
    console.error("GET /api/orgs/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT: Save update to temporary_details
router.put("/orgs/me", async (req, res) => {
  try {
    const orgId = req.headers["x-org-id"] || "6716001a9b8c2001abcd0001";
    const org = await StudentOrg.findById(orgId);
    if (!org) return res.status(404).json({ message: "Org not found" });

    org.temporary_details = {
      ...req.body,
      status: "Pending",
      created_at: new Date()
    };

    await org.save();
    res.json({ message: "Profile update submitted for review" });
  } catch (err) {
    console.error("PUT /api/orgs/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: All orgs (name + id)
router.get("/student-orgs", async (req, res) => {
  try {
    const orgs = await StudentOrg.find({}, { _id: 1, name: 1, department: 1 }).lean();
const formatted = orgs.map(o => ({
  _id: o._id.toString(),
  name: o.name,
  department: o.department || "Unknown Department"
}));
    res.json(formatted);
  } catch (err) {
    console.error("GET /api/student-orgs error:", err);
    res.status(500).json({ error: "Failed to fetch student orgs" });
  }
});

export default router;