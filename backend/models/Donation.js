
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
<<<<<<< HEAD
  donor:String,
  amount:Number,
  createdAt:{type:Date, default:Date.now}
=======
  donorName: { type: String, default: 'Anonymous' },
  amount: { type: Number, required: true },
  childName: { type: String, default: null },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', default: null },
  donorEmail: { type: String, default: null },
  donorPhone: { type: String, default: null },
  donationType: { type: String, enum: ['general', 'sponsorship'], default: 'general' },
  createdAt: { type: Date, default: Date.now }
>>>>>>> 145dd94 (Updated backend to use MongoDB URI with environment variables)
});

module.exports = mongoose.model('Donation', donationSchema);
