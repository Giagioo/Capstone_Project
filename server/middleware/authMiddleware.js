// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  // Ottieni il token dalla header
  const token = req.header('x-auth-token');

  // Verifica se non c'è token
  if (!token) {
    return res.status(401).json({ msg: 'Nessun token, autorizzazione negata' });
  }

  // Verifica il token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token non valido' });
  }
};

module.exports = authMiddleware;
