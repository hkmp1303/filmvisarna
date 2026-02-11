import React, { useState, useEffect } from 'react';
import '../css/LandingPage.css';

// Interface matches your MySQL 'film' table columns
interface Movie {
  filmid: number;        // PK from DB
  title: string;
  duration: number;
  language: string;
  cover_image: string;   // The image URL column
  description: string;
}

const LandingPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/film')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // 2. Filter the data
          const featuredMovieIds = [1, 3, 5];
          const selectedMovies = data.filter((movie: any) => featuredMovieIds.includes(movie.filmid));

          // 3. Save the FILTERED movies, not the original data
          setMovies(selectedMovies);
        } else {
          console.error("Data is not an array:", data);
          // Optional: handle error state here
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, []);
  return (
    <div className="landing-page-container">
      {/* Search and Filter Section */}
      <div className="search-section">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="filter-section">
        <button className="filter-btn main-filter">filter....</button>
        <button className="filter-btn date-filter">Datum</button>
      </div>

      {/* Movie Grid */}
      <main className="movie-grid">
        {loading && <p style={{ color: 'white' }}>Laddar filmer...</p>}

        {movies.map((movie) => (
          <div key={movie.filmid} className="movie-card">
            <div className="poster-container">
              {/* Use cover_image from DB */}
              <div
                className="poster-placeholder"
                style={{ backgroundImage: `url(${movie.cover_image})` }}
              >
                <div className="poster-overlay-text">
                  <h3>{movie.title}</h3>
                  <p>{movie.duration} min | {movie.language}</p>
                </div>
              </div>
            </div>
            <div className="card-info">
              <p className="movie-name">{movie.title}</p>
              <button className="details-btn">Detaljer</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default LandingPage;