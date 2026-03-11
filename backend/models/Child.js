const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  age:            { type: Number, required: true },
  gender:         { type: String, default: '' },   // no enum — accepts 'male', 'female', or ''
  photo:          { type: String, default: '' },
  story:          { type: String, default: '' },
  healthStatus:   { type: String, default: '' },
  educationLevel: { type: String, default: '' },
  isAdopted:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.Child || mongoose.model('Child', childSchema);