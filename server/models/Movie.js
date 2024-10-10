const mongoose = require('mongoose');
const reviewSchema = require('./Review');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
  },
  reviews: [reviewSchema],
});

module.exports = mongoose.model('Movie', movieSchema);
