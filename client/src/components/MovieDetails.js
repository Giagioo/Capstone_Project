import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [userReviews, setUserReviews] = useState([]);
  const isLoggedIn = !!localStorage.getItem('token'); 
  
  const API_KEY = 'b8fd75462b0fd75612e05aba109a46d8';

  useEffect(() => {
    
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: API_KEY,
              language: 'it-IT', 
            },
          }
        );
        setMovie(response.data);
      } catch (error) {
        console.error('Errore nel recuperare i dettagli del film:', error);
      } finally {
        setLoading(false);
      }
    };

    // Funzione per recuperare le recensioni degli utenti dal backend
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/movies/${id}/reviews`);
        setUserReviews(response.data);
      } catch (error) {
        console.error('Errore nel recuperare le recensioni:', error);
      }
    };

    fetchMovieDetails();
    fetchUserReviews();
  }, [id]);

  const token = localStorage.getItem('token');
  console.log('Token:', token);
  

  const handleSubmitReview = async (e) => {
    e.preventDefault();
  
    if (!isLoggedIn) {
      alert('Devi essere loggato per lasciare una recensione.');
      return;
    }
  
    const newReview = {
      rating: rating,
      text: reviewText,
    };
  
    try {
      // Qui dovrebbe esserci la definizione di 'token'
      const response = await axios.post(
        `http://localhost:5000/api/movies/${id}/reviews`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Uso di 'token'
          },
        }
      );
  
      setUserReviews(response.data); // Aggiorna la lista delle recensioni
      setReviewText(''); // Resetta il form
      setRating(5);
    } catch (error) {
      console.error('Errore nell\'aggiungere la recensione:', error);
      alert('Si è verificato un errore nell\'aggiungere la recensione.');
    }
  };
  

  if (loading) {
    return <div className="movie-details-container">Caricamento...</div>;
  }

  if (!movie) {
    return <div className="movie-details-container">Film non trovato.</div>;
  }

  return (
    <div className="movie-details-container">
      <h1>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-details-poster"
      />
      <p><strong>Data di uscita:</strong> {movie.release_date}</p>
      <p><strong>Valutazione media:</strong> {movie.vote_average}/10</p>
      <p><strong>Genere:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
      <p><strong>Trama:</strong> {movie.overview}</p>

      {/* Sezione recensioni degli utenti */}
      <h2>Recensioni degli Utenti</h2>
      {userReviews.length > 0 ? (
        userReviews.map((review, index) => (
          <div key={index} className="review">
            <p><strong>{review.userId}</strong>: {review.text}</p>
            <p>Valutazione: {review.rating}/5</p>
          </div>
        ))
      ) : (
        <p>Non ci sono recensioni per questo film.</p>
      )}

      {/* Form per aggiungere una nuova recensione */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmitReview}>
          <h3>Lascia una recensione</h3>
          <div className="form-group">
            <label>Valutazione:</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="form-control"
            >
              {[5, 4, 3, 2, 1].map(value => (
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
          <button type="submit" className="btn btn-primary">Invia Recensione</button>
        </form>
      ) : (
        <p>Devi essere loggato per lasciare una recensione.</p>
      )}
    </div>
  );
};

export default MovieDetails;
