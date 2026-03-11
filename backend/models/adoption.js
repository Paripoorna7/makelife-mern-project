const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  childId:       { type: String, required: true },   // ✅ Store as String always
  childName:     { type: String, required: true },
  applicantName: { type: String, required: true },
  address:       { type: String, required: true },
  annualIncome:  { type: Number, required: true },
  familyMembers: { type: Number, required: true },
  phone:         { type: String, required: true },
  email:         { type: String, required: true },
  reason:        { type: String, required: true },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Adoption', adoptionSchema);