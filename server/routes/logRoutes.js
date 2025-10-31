import express from "express";
import UserLog from "../models/UserLog.js";

const router = express.Router();

router.get("/activity-logs", async (req, res) => {
  try {
    const logs = await UserLog.find().sort({ timestamp: -1 }).lean();
    const formatted = logs.map(log => ({
      _id: log._id.toString(),
      user_id: log.user_id.toString(),
      role: log.role,
      action: log.action,
      timestamp: log.timestamp
    }));
    res.json(formatted);
  } catch (err) {
    console.error("GET /api/activity-logs error:", err);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

export default router;