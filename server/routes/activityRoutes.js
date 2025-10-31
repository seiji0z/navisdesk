import express from "express";
import Activity from "../models/Activity.js";
import StudentOrg from "../models/StudentOrg.js";

const router = express.Router();

// GET: All activities for a specific org (used by my-activities.js)
router.get("/activities/my", async (req, res) => {
  try {
    const orgId = req.headers["x-org-id"] || "6716001a9b8c2001abcd0001"; // ICON fallback
    const activities = await Activity.find({ org_id: orgId })
      .sort({ created_at: -1 })
      .lean();

    // Format exactly like your frontend expects
    const formatted = activities.map(a => ({
      id: a._id.toString(),
      _id: a._id.toString(),
      org_id: a.org_id.toString(),
      title: a.title,
      description: a.description,
      acad_year: a.acad_year,
      term: a.term,
      date_start: a.date_start,
      date_end: a.date_end,
      venue: a.venue,
      objectives: a.objectives,
      sdgs: a.sdgs,
      evidences: a.evidences,
      supporting_docs: a.supporting_docs,
      submitted_by: a.submitted_by.toString(),
      submitted_at: a.submitted_at || "",
      reviewed_by: a.reviewed_by ? a.reviewed_by.toString() : null,
      reviewed_at: a.reviewed_at || null,
      status: a.status,
      created_at: a.created_at
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET /api/activities/my error:", err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// GET: Single activity by ID
router.get("/activities/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).lean();
    if (!activity) return res.status(404).json({ error: "Activity not found" });

    const formatted = {
      id: activity-CHILD._id.toString(),
      _id: activity._id.toString(),
      org_id: activity.org_id.toString(),
      title: activity.title,
      description: activity.description,
      acad_year: activity.acad_year,
      term: activity.term,
      date_start: activity.date_start,
      date_end: activity.date_end,
      venue: activity.venue,
      objectives: activity.objectives,
      sdgs: activity.sdgs,
      evidences: activity.evidences,
      supporting_docs: activity.supporting_docs,
      submitted_by: activity.submitted_by.toString(),
      submitted_at: activity.submitted_at || "",
      reviewed_by: activity.reviewed_by ? activity.reviewed_by.toString() : null,
      reviewed_at: activity.reviewed_at || null,
      status: activity.status,
      created_at: activity.created_at
    };

    res.json(formatted);
  } catch (err) {
    console.error("GET /api/activities/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;