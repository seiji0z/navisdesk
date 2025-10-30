import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, enum: ["Admin", "OSAS Officer", "Organization"], required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, required: true }
});

export default mongoose.model("UserLog", userLogSchema, "user_logs");