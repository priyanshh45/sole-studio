const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  user: String,
  rating: Number,
  message: String
});
module.exports = mongoose.model('Review', reviewSchema);
