const jwt = require('jsonwebtoken');
require('dotenv').config(); 

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('Authorization Header:', authHeader);
  console.log('Token Estratto:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token Decodificato:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token Non Valido:', err.message);
    res.status(401).json({ msg: 'Token is not valid.' });
  }
};
