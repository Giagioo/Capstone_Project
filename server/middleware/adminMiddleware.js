const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('role');
    if (!user) {
      return res.status(404).json({ msg: 'Utente non trovato.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Accesso negato: amministratore richiesto.' });
    }

    next();
  } catch (err) {
    console.error('Errore nel middleware admin:', err.message);
    res.status(500).send('Errore del server.');
  }
};

module.exports = adminMiddleware;
