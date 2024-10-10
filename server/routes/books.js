const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Recupera tutti i libri
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Errore nel recuperare i libri:', error);
    res.status(500).send('Errore del server');
  }
});

// Recupera un libro per ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send('Libro non trovato');
    }
    res.json(book);
  } catch (error) {
    console.error('Errore nel recuperare il libro:', error);
    res.status(500).send('Errore del server');
  }
});

// Crea un nuovo libro (solo per amministratori)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, author, description, publishedDate, coverImageUrl } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      description,
      publishedDate,
      coverImageUrl,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Errore nel creare il libro:', error);
    res.status(500).send('Errore del server');
  }
});

// Aggiorna un libro (solo per amministratori)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, author, description, publishedDate, coverImageUrl } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, publishedDate, coverImageUrl },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).send('Libro non trovato');
    }

    res.json(updatedBook);
  } catch (error) {
    console.error('Errore nell\'aggiornare il libro:', error);
    res.status(500).send('Errore del server');
  }
});

// Elimina un libro (solo per amministratori)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).send('Libro non trovato');
    }

    res.json({ msg: 'Libro eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminare il libro:', error);
    res.status(500).send('Errore del server');
  }
});

module.exports = router;
