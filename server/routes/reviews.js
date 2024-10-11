const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Movie = require('../models/movie');
const mongoose = require('mongoose');

// Rotta per aggiornare una recensione
router.put('/:reviewId', auth, async (req, res) => {
  const { reviewId } = req.params;
  const { rating, reviewText } = req.body;

  console.log(`Aggiornamento recensione: ${reviewId}, rating: ${rating}, reviewText: ${reviewText}`);

  // Validazione di base
  if (!rating || !reviewText) {
    console.log('Campi mancanti nella richiesta.');
    return res.status(400).json({ msg: 'Tutti i campi sono obbligatori.' });
  }

  try {
    // Trova il film che contiene la recensione
    const movie = await Movie.findOne({ 'reviews._id': reviewId });

    if (!movie) {
      console.log('Recensione non trovata nel film.');
      return res.status(404).json({ msg: 'Recensione non trovata.' });
    }

    console.log(`Movie trovato: ${movie.title}, tmdbId: ${movie.tmdbId}`);

    // Trova la recensione
    const review = movie.reviews.id(reviewId);

    // Verifica che la recensione appartenga all'utente
    if (review.user.toString() !== req.user.id) {
      console.log('Utente non autorizzato a modificare questa recensione.');
      return res.status(401).json({ msg: 'Non autorizzato a modificare questa recensione.' });
    }

    // Aggiorna i campi della recensione
    review.rating = rating;
    review.reviewText = reviewText;

    console.log(`Salvataggio del film con tmdbId: ${movie.tmdbId}`);

    // Salva il documento Movie
    await movie.save();

    console.log('Recensione aggiornata con successo.');
    res.json(review);
  } catch (error) {
    console.error('Errore nell\'aggiornare la recensione:', error.message);
    res.status(500).send('Server Error');
  }
});

// Rotta per eliminare una recensione
router.delete('/:reviewId', auth, async (req, res) => {
  const { reviewId } = req.params;

  // Verifica se reviewId è un ObjectId valido
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).json({ msg: 'ID recensione non valido.' });
  }

  try {
    // Trova il film che contiene la recensione
    const movie = await Movie.findOne({ 'reviews._id': reviewId });

    if (!movie) {
      return res.status(404).json({ msg: 'Recensione non trovata.' });
    }

    // Trova la recensione
    const review = movie.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({ msg: 'Recensione non trovata.' });
    }

    // Verifica che la recensione appartenga all'utente
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Non autorizzato a eliminare questa recensione.' });
    }

    // Rimuovi la recensione usando $pull
    await Movie.updateOne(
      { 'reviews._id': reviewId },
      { $pull: { reviews: { _id: reviewId } } }
    );

    res.json({ msg: 'Recensione rimossa con successo.' });
  } catch (error) {
    console.error('Errore nell\'eliminare la recensione:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;