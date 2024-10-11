// server/routes/movies.js
const express = require('express');
const router = express.Router();
const axios = require('axios'); // Importazione di axios
const Movie = require('../models/movie'); // Modello del film
const auth = require('../middleware/authMiddleware'); // Middleware di autenticazione

// Rotta per ottenere i dettagli di un film dall'API TMDB e salvarlo nel database se non esiste
router.get('/:id', async (req, res) => {
  const movieId = req.params.id; // ID del film da TMDB

  try {
    let movie = await Movie.findOne({ tmdbId: movieId });

    if (!movie) {
      // Se il film non esiste nel database, recuperalo dall'API TMDB e salvalo
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: process.env.TMDB_API_KEY, // Assicurati di avere una chiave API valida
          language: 'it-IT',
        },
      });

      if (response.data.Response === 'False' || !response.data.title) {
        return res.status(404).json({ msg: 'Film non trovato nell\'API TMDB.' });
      }

      movie = new Movie({
        tmdbId: movieId, // Includi il tmdbId
        title: response.data.title,
        description: response.data.overview,
        publishedDate: new Date(response.data.release_date),
        coverImageUrl: response.data.poster_path ? `https://image.tmdb.org/t/p/w500${response.data.poster_path}` : '',
        reviews: []
      });

      await movie.save();
    }

    res.json(movie);
  } catch (error) {
    console.error('Errore nel recuperare il film:', error.message);
    res.status(500).send('Server Error');
  }
});

// Rotta per aggiungere una recensione a un film
router.post('/:id/reviews', auth, async (req, res) => {
  const { rating, reviewText } = req.body;

  // Validazione di base
  if (!rating || !reviewText) {
    return res.status(400).json({ msg: 'Tutti i campi sono obbligatori.' });
  }

  try {
    // Trova il film per ID (tmdbId)
    const movie = await Movie.findOne({ tmdbId: req.params.id });
    if (!movie) {
      return res.status(404).json({ msg: 'Film non trovato.' });
    }

    // Crea una nuova recensione
    const newReview = {
      user: req.user.id,
      rating,
      reviewText,
    };

    // Aggiungi la recensione all'inizio dell'array
    movie.reviews.unshift(newReview);

    // Salva il film aggiornato
    await movie.save();

    // Popola il campo `user` nella recensione per ottenere dettagli dell'utente
    const populatedReview = await Movie.findOne({ tmdbId: req.params.id })
      .select('reviews')
      .populate('reviews.user', 'username'); // Assicurati che il modello User abbia un campo `username`

    // Rispondi con la recensione appena aggiunta
    res.json(populatedReview.reviews[0]);
  } catch (error) {
    console.error('Errore nell\'aggiungere la recensione:', error.message);
    res.status(500).send('Server Error');
  }
});

// Recupera le recensioni di un film
router.get('/:movieId/reviews', async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findOne({ tmdbId: movieId }).populate('reviews.user', 'username');
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
