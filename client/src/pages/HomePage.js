import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

const API_KEY = "b8fd75462b0fd75612e05aba109a46d8";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let allMovies = [];
        const totalPages = 25;
        for (let page = 1; page <= totalPages; page++) {
          const response = await axios.get(
            'https://api.themoviedb.org/3/movie/popular',
            {
              params: {
                api_key: API_KEY,
                language: 'it-IT',
                page: page,
              },
            }
          );
          allMovies = allMovies.concat(response.data.results);
        }

        // Rimuovi i duplicati
        const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());

        setMovies(uniqueMovies);
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
    <div className="homepage-container">
      <div className="movie-grid">
        {movies.map(movie => (
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
            </div>
          </div>
        ))}
      </div>
      {/* Altri elementi della pagina, come il pulsante "Carica Altri Film" */}
    </div>
  );
};

export default HomePage;
