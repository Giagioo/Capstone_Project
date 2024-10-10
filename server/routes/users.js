const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Recupera le recensioni dell'utente loggato
router.get('/me/reviews', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('reviews');
    res.status(200).json(user.reviews);
  } catch (error) {
    console.error('Errore nel recuperare le recensioni dell\'utente:', error);
    res.status(500).send('Errore nel recuperare le recensioni dell\'utente');
  }
});

module.exports = router;
