import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  org_id: { type: mongoose.Schema.Types.ObjectId, ref: "StudentOrg", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  acad_year: { type: String, required: true },
  term: { type: String, required: true },
  date_start: { type: Date, required: true },
  date_end: { type: Date, required: true },
  venue: { type: String, required: true },
  objectives: { type: String, required: true },
  sdgs: { type: [String], default: [] },
  evidences: { type: [String], default: [] }, // file paths
  supporting_docs: { type: [String], default: [] }, // file paths
  submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: "StudentOrg", required: true },
  submitted_at: { type: Date }, // ← FIXED: was { type:-By: Date }
  reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: "AdminOsas" },
  reviewed_at: { type: Date },
  status: { type: String, enum: ["Pending", "Approved", "Returned"], default: "Pending" },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Activity", activitySchema, "activities");