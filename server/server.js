const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const path = require('path');



const app = express();



// Middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));
app.use(express.json());

// Servire le immagini statiche
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connesso...'))
.catch(err => console.error('Errore di connessione al DB:', err));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));

// Rotte di autenticazione
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rotte per film
const movieRoutes = require('./routes/movies');
app.use('/api/movies', movieRoutes);

// Importa il router delle recensioni
const reviewsRoute = require('./routes/reviews');

// Usa il router delle recensioni
app.use('/api/reviews', reviewsRoute);

//Rotta per user
app.use('/api/users', userRoutes);

//Rotta per libri
app.use('/api/books', bookRoutes);

