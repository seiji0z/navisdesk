const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['Admin', 'OSAS Officer', 'Student Org'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  dateRegistered: { type: String, required: true },
  lastLogin: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);