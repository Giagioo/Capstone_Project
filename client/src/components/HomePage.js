import React, { useState, useEffect } from 'react';
import tmdb from '../api/tmdb';
import MovieCarousel from './MovieCarousel';
import './HomePage.css'; 

const HomePage = () => {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, topRatedRes, popularRes] = await Promise.all([
          tmdb.get('/trending/movie/week'),
          tmdb.get('/movie/top_rated'),
          tmdb.get('/movie/popular'),
        ]);

        setTrending(trendingRes.data.results);
        setTopRated(topRatedRes.data.results);
        setPopular(popularRes.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Errore nel recuperare i film:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="loading-message text-center text-white mt-5">Caricamento...</div>;
  }

  if (error) {
    return <div className="error-message text-center text-danger mt-5">Impossibile recuperare i film. Riprova più tardi.</div>;
  }

  return (
    <div className="homepage bg-dark">
      <div className="container-fluid px-4">
        <MovieCarousel title="Trend della Settimana" movies={trending} />
        <MovieCarousel title="Top Rated" movies={topRated} />
        <MovieCarousel title="Popolari" movies={popular} />
      </div>
    </div>
  );
};

export default HomePage;
