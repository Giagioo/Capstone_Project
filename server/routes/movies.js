const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const authMiddleware = require('../middleware/authMiddleware');

// Aggiungi una recensione a un film
router.post('/:movieId/reviews', authMiddleware, async (req, res) => {
  const { movieId } = req.params;
  const { rating, text } = req.body;
  const userId = req.user.id;
  const username = req.user.username;

  try {
    // Recupera il titolo del film da TMDb
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'it-IT',
      },
    });
    const movieTitle = tmdbResponse.data.title;

    // Aggiorna il modello Movie
    let movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      movie = new Movie({ tmdbId: movieId, reviews: [] });
    }

    const newReview = {
      user: userId,
      username: username,
      rating: rating,
      text: text,
    };

    movie.reviews.push(newReview);
    await movie.save();

    // Aggiorna il modello User
    const user = await User.findById(userId);
    const userReview = {
      movieId: parseInt(movieId),
      movieTitle: movieTitle,
      rating: rating,
      text: text,
    };
    user.reviews.push(userReview);
    await user.save();

    res.status(201).json(movie.reviews);
  } catch (error) {
    console.error('Errore nell\'aggiungere la recensione:', error);
    res.status(500).send('Errore nell\'aggiungere la recensione');
  }
});

// Recupera le recensioni di un film
router.get('/:movieId/reviews', async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      return res.status(200).json([]); 
    }

    res.status(200).json(movie.reviews);
  } catch (error) {
    console.error('Errore nel recuperare le recensioni:', error);
    res.status(500).send('Errore nel recuperare le recensioni');
  }
});

module.exports = router;
