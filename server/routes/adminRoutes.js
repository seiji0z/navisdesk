import express from "express";
import AdminOsas from "../models/AdminOsas.js";

const router = express.Router();

router.get("/admins", async (req, res) => {
  try {
    const admins = await AdminOsas.find({}, { _id: 1, name: 1 }).lean();
    const formatted = admins.map(a => ({
      _id: a._id.toString(),
      name: a.name
    }));
    res.json(formatted);
  } catch (err) {
    console.error("GET /api/admins error:", err);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

export default router;