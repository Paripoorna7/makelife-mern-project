const mongoose = require('mongoose');

const goodsDonationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  items: { type: String, required: true },
  message: { type: String },
  
  address: { type: String },
  pincode: { type: String },
  state: { type: String },
  quantity: { type: String },
  condition: { type: String },
  
  foodType: { type: String },
  foodExpiry: { type: String },
  foodPackaged: { type: String },
  clothingType: { type: String },
  clothingAge: { type: String },
  clothingGender: { type: String },
  clothesWashed: { type: String },
  bookType: { type: String },
  bookAge: { type: String },
  bookLanguage: { type: String },
  toyType: { type: String },
  toyAge: { type: String },
  toyParts: { type: String },
  hygieneItems: { type: String },
  blanketType: { type: String },
  blanketSize: { type: String },
  statItems: { type: String },
  footwearType: { type: String },
  footwearSize: { type: String },
  notes: { type: String },

  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GoodsDonation', goodsDonationSchema);
