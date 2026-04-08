
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor:String,
  amount:Number,
  createdAt:{type:Date, default:Date.now}
});

module.exports = mongoose.model('Donation', donationSchema);
