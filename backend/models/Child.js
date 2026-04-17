const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name:   String,
  age:    Number,
  gender: { type: String, enum: ['Boy', 'Girl', ''], default: '' },
  story:  String,
  photo:  String
});

module.exports = mongoose.model("Child", childSchema);
