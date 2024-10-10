import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MoviesList.css';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/popular',
          {
            params: {
              api_key: API_KEY,
              language: 'it-IT',
              page: 1,
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error('Errore nel recuperare i film:', error);
      }
    };

    if (API_KEY) {
      fetchMovies();
    } else {
      console.error('API_KEY non è definita');
    }
  }, [API_KEY]);

  return (
    <div className="movies-list-container">
      <h1>Film Popolari</h1>
      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
              ) : (
                <div className="movie-placeholder">
                  <p>Immagine non disponibile</p>
                </div>
              )}
              <div className="movie-info">
                <h5>{movie.title}</h5>
                <p>Data di uscita: {movie.release_date}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Nessun film disponibile.</p>
        )}
      </div>
    </div>
  );
};

export default MoviesList;
