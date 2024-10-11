const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Movie = require('../models/movie');
const User = require('../models/User');

// Rotta per ottenere le informazioni dell'utente e le sue recensioni
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Utente non trovato.' });
    }

    const reviews = await Movie.find({ 'reviews.user': req.user.id })
      .select('title reviews tmdbId')
      .populate('reviews.user', 'username');

    const userReviews = [];
    reviews.forEach(movie => {
      movie.reviews.forEach(review => {
        if (review.user._id.toString() === req.user.id) {
          userReviews.push({
            _id: review._id,
            movieTitle: movie.title,
            tmdbId: movie.tmdbId,
            rating: review.rating,
            reviewText: review.reviewText,
            createdAt: review.createdAt,
          });
        }
      });
    });

    res.json({ user, reviews: userReviews });
  } catch (error) {
    console.error('Errore nel recuperare le informazioni dell\'utente:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
