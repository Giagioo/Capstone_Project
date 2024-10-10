const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Rotta per la registrazione con validazione
router.post(
  '/register',
  [
    // Validazione dei campi richiesti
    body('username', 'Username è richiesto').not().isEmpty(),
    body('email', 'Inserisci un email valida').isEmail(),
    body('password', 'Password è richiesta e deve essere almeno 6 caratteri').isLength({ min: 6 }),
    body('role', 'Il ruolo deve essere user o admin').optional().isIn(['user', 'admin']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Restituisce un errore 400 con i messaggi di validazione
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      // Controlla se l'utente esiste già
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'Utente già esistente' });
      }

      // Crea una nuova istanza di User
      user = new User({
        username,
        email,
        password,
        role: role || 'user', // Imposta il ruolo, default a 'user' se non fornito
      });

      // Salva l'utente (hash della password viene gestito dal middleware 'pre')
      await user.save();

      // Crea il payload per il JWT
      const payload = {
        user: {
          id: user.id,
          role: user.role, 
        },
      };

      // Firma il token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '15d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.error('Errore nella registrazione:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Rotta per il login
router.post(
  '/login',
  [
    // Validazione dei campi richiesti
    body('email', 'Inserisci un email valida').isEmail(),
    body('password', 'Password è richiesta').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Restituisce un errore 400 con i messaggi di validazione
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Recupera l'utente senza .lean()
      const user = await User.findOne({ email });
      console.log('Utente trovato:', user);
      console.log('Tipo di user:', typeof user);
      console.log('User è un\'istanza di User:', user instanceof User);

      if (!user) {
        return res.status(400).json({ msg: 'Utente non trovato' });
      }

      // Confronta la password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Password non valida' });
      }

      // Crea il payload per il JWT includendo il ruolo
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      // Firma il token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '15d' }, 
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.error('Errore nel login:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
