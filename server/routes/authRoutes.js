// server/routes/authRoutes.js
import express from "express";
import { OAuth2Client } from "google-auth-library";
import { requireAuth } from "../middleware/auth.js"; // NEW: Correct import
import AdminOsas from "../models/AdminOsas.js";
import StudentOrg from "../models/StudentOrg.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ---------- GOOGLE GIS LOGIN ---------- */
router.post("/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "No credential" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase().trim();
    if (!email) return res.status(400).json({ error: "No email" });

    // DB lookup
    const admin = await AdminOsas.findOne({ email }).lean();
    if (admin) {
      req.session.user = { email, role: admin.role };
      return res.json({ success: true, role: admin.role }); // CHANGED: Return JSON with role
    }

    const org = await StudentOrg.findOne({ email }).lean();
    if (org) {
      req.session.user = { email, role: "org" };
      return res.json({ success: true, role: "org" }); // CHANGED: Return JSON with role
    }

    return res.status(403).json({ error: "Email not authorized" });
  } catch (e) {
    console.error("Google auth error:", e);
    return res.status(500).json({ error: "Server error" }); // CHANGED: JSON error
  }
});

/* ---------- SESSION CHECK ---------- */
router.get("/me", requireAuth, (req, res) => {
  res.json({
    email: req.session.user.email,
    role: req.session.user.role,
    loggedIn: true,
  });
});

/* ---------- LOGOUT ---------- */
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

export default router;
