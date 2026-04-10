const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  role:       { type: String, required: true, trim: true },
  bio:        { type: String, default: '' },
  photo:      { type: String, default: '👤' },
  email:      { type: String, default: '' },
  phone:      { type: String, default: '' },
  joinedYear: { type: Number, default: () => new Date().getFullYear() },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);