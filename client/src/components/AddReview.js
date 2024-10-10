import React, { useState } from 'react';
import axios from 'axios';

const AddReview = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);
  const [coverImage, setCoverImage] = useState('');
  const [genre, setGenre] = useState('');
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Recupera l'ID dell'utente loggato
    const userId = localStorage.getItem('userId'); // Assicurati che l'utente sia loggato e che l'ID sia nel localStorage
  
    const review = { title, text, rating, userId };
    console.log('Dati da inviare:', review); // Aggiungi questo per controllare i dati
  
    try {
      const response = await axios.post('http://localhost:5000/api/reviews', review);
      console.log('Risposta dal server:', response.data);
    } catch (error) {
      console.error('Errore nell\'aggiungere la recensione', error.response ? error.response.data : error);
    }
  };
  
  
  
  return (
    <div className="container">
      <h2>Aggiungi una nuova recensione</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titolo</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Testo della recensione</label>
          <textarea
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Valutazione</label>
          <select
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Aggiungi recensione</button>
      </form>
    </div>
  );
};

export default AddReview;
