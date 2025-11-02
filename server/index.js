// server/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session"; // NEW
import path from "path";

import userRoutes from "./routes/userRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // NEW

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5000", // Adjust if your frontend runs on a different port/origin
    credentials: true, // Allow cookies/sessions
  })
);
app.use(express.json());

app.use(express.static(path.join(process.cwd(), ".")));

app.use(
  session({
    secret: process.env.SESSION_SECRET, // ← Use .env value
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set true in production with HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// Mount routes
app.use("/api", userRoutes);
app.use("/api", logRoutes);
app.use("/api", adminRoutes);
app.use("/api", orgRoutes);
app.use("/api", activityRoutes);
app.use("/api/auth", authRoutes); // NEW: Mount at /api/auth to avoid conflicts

// Start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("Routes loaded:");
      console.log("   GET /api/users");
      console.log("   GET /api/activity-logs");
      console.log("   GET /api/admins");
      console.log("   GET /api/student-orgs");
      console.log("   GET/PUT /api/orgs/me");
      console.log("   GET /api/activities/my");
      console.log("   POST /api/auth/google"); // NEW
      console.log("   GET /api/auth/me"); // NEW
      console.log("   POST /api/auth/logout"); // NEW
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
