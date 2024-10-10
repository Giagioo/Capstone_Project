const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Aggiungi una nuova recensione
router.post('/', (req, res) => {
  const { title, text, rating, coverImage, genre } = req.body;

  const newReview = new Review({
    title,
    text,
    rating,
    coverImage,
    genre,
    user: req.user._id, // Assumendo che utilizzi l'autenticazione e che l'utente sia nel req.user
  });

  newReview.save()
    .then(review => res.status(201).json(review))
    .catch(err => res.status(500).json({ error: 'Errore nel salvare la recensione' }));
});


// Recupera recensioni con paginazione
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Page e limit sono opzionali, con valori di default

  try {
    const reviews = await Review.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Review.countDocuments();

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare le recensioni', error });
  }
});


router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare le recensioni dell\'utente', error });
  }
});
// Ottiene una valutazione media delle recensioni 
router.get('/movie/:movieId/rating', async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length ? (totalRating / reviews.length).toFixed(2) : 0;

    res.json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel calcolare la valutazione media' });
  }
});

// Modifica recensione
router.put('/:reviewId', async (req, res) => {
  const { title, text, rating } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { title, text, rating },
      { new: true }
    );
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel modificare la recensione', error });
  }
});

// Elimina recensione
router.delete('/:reviewId', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: 'Recensione eliminata' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel eliminare la recensione', error });
  }
});

// Aggiungi un commento
router.post('/:reviewId/comments', (req, res) => {
  const { reviewId } = req.params;
  const { userId, comment } = req.body;

  // Trova la recensione e aggiungi il commento
  Review.findById(reviewId)
    .then(review => {
      if (!review) {
        return res.status(404).send("Recensione non trovata");
      }
      
      const newComment = { userId, comment, createdAt: new Date() };
      review.comments.push(newComment);  // Aggiungi il commento alla recensione
      return review.save();
    })
    .then(updatedReview => {
      res.status(200).json(updatedReview.comments);
    })
    .catch(err => {
      res.status(500).send("Errore nel salvare il commento");
    });
});

// Recupera i commenti di una recensione
router.get('/:reviewId/comments', (req, res) => {
  const { reviewId } = req.params;

  Review.findById(reviewId)
    .then(review => {
      if (!review) {
        return res.status(404).send("Recensione non trovata");
      }

      res.status(200).json(review.comments);
    })
    .catch(err => {
      res.status(500).send("Errore nel recuperare i commenti");
    });
});

module.exports = router;

