import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const { query } = useParams();
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const API_KEY = "b8fd75462b0fd75612e05aba109a46d8";

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/search/movie',
          {
            params: {
              api_key: API_KEY,
              language: 'it-IT',
              query: query,
              include_adult: false,
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error('Errore nel recuperare i risultati di ricerca:', error);
      }
    };

    if (API_KEY) {
      fetchSearchResults();
    } else {
      console.error('API_KEY non è definita');
    }
  }, [API_KEY, query]);

  return (
    <div className="search-results-container">
      <h1>Risultati per "{query}"</h1>
      <div className="movie-grid">
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
                <p>{movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Nessun risultato trovato.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
