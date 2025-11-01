// server/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import activityRoutes from "./routes/activityRoutes.js"; // GOOD

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api", userRoutes);
app.use("/api", logRoutes);
app.use("/api", adminRoutes);
app.use("/api", orgRoutes);
app.use("/api", activityRoutes);

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
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });