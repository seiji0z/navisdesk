import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  abbreviation: String,
  email: String,
  department: String,
  type: String,
  adviser: { name: String, email: String },
  description: String,
  fb_link: String,
  ig_link: String,
  website_link: String,
  created_at: Date,
  last_log: Date,
  status: String,
  profile_pic: String,
  actions: [String]
});

export default mongoose.model("StudentOrg", schema, "student_organizations");