// server/models/Movie.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  reviewText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MovieSchema = new mongoose.Schema({
  imdbId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: String,
  description: String,
  publishedDate: Date,
  coverImageUrl: String,
  reviews: [ReviewSchema],
});

// Prevenire OverwriteModelError
module.exports = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
