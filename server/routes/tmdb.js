const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); 

const TMDB_API_KEY = process.env.TMDB_API_KEY; 

// Rotta per ottenere i dettagli di un film da TMDB
router.get('/movies/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'it-IT',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Errore nel recuperare i dettagli del film da TMDB:', error.message);
    res.status(500).json({ msg: 'Errore nel recuperare i dettagli del film.' });
  }
});

module.exports = router; 
