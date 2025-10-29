import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ["admin", "osas"] },
  status: String,
  created_at: Date,
  last_log: Date,
  actions: [String],
  profile_pic: String
});

export default mongoose.model("AdminOsas", schema, "admin_osas");