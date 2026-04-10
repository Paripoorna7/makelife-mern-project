// models/Member.js  — create this new file in your models/ folder
const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  fullName:      { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true },
  role: {
    type: String,
    enum: ['trustee', 'patron', 'volunteer', 'member'],
    default: 'member',
  },
  bio:           { type: String, default: '' },
  phone:         { type: String, default: '' },
  photo:         { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive'],
    default: 'pending',
  },
  contributions: [{ type: String }],
  joinedAt:      { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);