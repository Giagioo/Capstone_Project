import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="movie-card">
      <Link to={`/movies/${movie.id}`} className="movie-link d-block">
        <img
          src={imageUrl}
          alt={movie.title}
          className="movie-poster img-fluid"
          loading="lazy"
        />
        <div className="movie-info mt-2">
          <h5 className="movie-title mb-1 text-truncate">{movie.title}</h5>
          <p className="movie-rating mb-0">⭐ {movie.vote_average}</p>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
