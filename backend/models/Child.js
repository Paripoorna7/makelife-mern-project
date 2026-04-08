const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: String,
  age: Number,
  story: String,
  photo: String
});

module.exports = mongoose.model("Child", childSchema);
