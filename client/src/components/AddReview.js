import React, { useState, useContext } from 'react';
import axios from '../utlis/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const AddReview = ({ movieId, onReviewAdded }) => {
  const { authData } = useContext(AuthContext);
  const isLoggedIn = !!authData.token;

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validazione di base
    if (reviewText.trim() === '') {
      setError('La recensione non può essere vuota.');
      return;
    }

    try {
      const response = await axios.post(`/movies/${movieId}/reviews`, {
        rating,
        reviewText,
      });

      // Aggiorna la lista delle recensioni nel componente padre
      if (onReviewAdded) {
        onReviewAdded(response.data);
      }

      setSuccess('Recensione aggiunta con successo!');
      setRating(5);
      setReviewText('');
    } catch (error) {
      console.error('Errore nell\'aggiungere la recensione:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        setError(error.response.data.msg);
      } else {
        setError('Errore nell\'aggiungere la recensione.');
      }
    }
  };

  return (
    <div className="add-review-container">
      <h3>Lascia una recensione</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmitReview}>
        <div className="form-group">
          <label>Valutazione:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="form-control"
          >
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Recensione:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Invia Recensione</button>
      </form>
    </div>
  );
};

export default AddReview;
