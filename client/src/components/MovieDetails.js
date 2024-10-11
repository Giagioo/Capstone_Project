import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../utlis/axiosInstance';
import './MovieDetails.css';
import AddReview from './AddReview'; // Importa AddReview
import { AuthContext } from '../context/AuthContext'; // Importa AuthContext

const MovieDetails = () => {
  const { id } = useParams(); 
  const { authData } = useContext(AuthContext); // Consuma AuthContext
  const isLoggedIn = !!authData.token; 

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Recupera i dettagli del film tramite il backend
        const response = await axios.get(`/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Errore nel recuperare i dettagli del film:', error);
        setError('Errore nel recuperare i dettagli del film.');
      } finally {
        setLoading(false);
      }
    };

    // Funzione per recuperare le recensioni degli utenti dal backend
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`/movies/${id}/reviews`);
        setUserReviews(response.data);
      } catch (error) {
        console.error('Errore nel recuperare le recensioni:', error);
      }
    };

    fetchMovieDetails();
    fetchUserReviews();
  }, [id]);

  // Funzione per gestire l'aggiunta di una nuova recensione
  const handleReviewAdded = (newReview) => {
    setUserReviews([newReview, ...userReviews]);
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
        src={movie.coverImageUrl}
        alt={movie.title}
        className="movie-details-poster"
      />
      <p><strong>Data di uscita:</strong> {movie.publishedDate ? new Date(movie.publishedDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Valutazione media:</strong> {movie.vote_average}/10</p>
      <p><strong>Genere:</strong> {movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'N/A'}</p>
      <p><strong>Trama:</strong> {movie.description}</p>

      {/* Sezione recensioni degli utenti */}
      <h2>Recensioni degli Utenti</h2>
      {userReviews.length > 0 ? (
        userReviews.map((review) => (
          <div key={review._id} className="review">
            <p><strong>{review.user.username}</strong>: {review.reviewText}</p>
            <p>Valutazione: {review.rating}/10</p>
          </div>
        ))
      ) : (
        <p>Non ci sono recensioni per questo film.</p>
      )}

      {/* Form per aggiungere una nuova recensione */}
      <div className="add-review-section mt-5">
        {isLoggedIn ? (
          <AddReview movieId={id} onReviewAdded={handleReviewAdded} />
        ) : (
          <p>
            <Link to="/register" className="auth-link">Registrati</Link> o{' '}
            <Link to="/login" className="auth-link">Effettua il login</Link> per lasciare una recensione.
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
