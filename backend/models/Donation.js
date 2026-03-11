const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: { type: String, default: 'Anonymous' },
  amount: { type: Number, required: true },
  childName: { type: String, default: null },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', default: null },
  donationType: { type: String, enum: ['general', 'sponsorship'], default: 'general' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);