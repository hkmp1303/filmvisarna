import React from 'react';
import '../css/LandingPage.css';

interface Movie {
  id: number;
  title: string;
  image: string;
}

const MovieGallery: React.FC = () => {
  const movies: Movie[] = [
    { id: 1, title: 'NAME HERE', image: 'link-to-image-1.jpg' },
    { id: 2, title: 'ALTERNATIVE POSTER', image: 'link-to-image-2.jpg' },
    { id: 3, title: 'NAME HERE', image: 'link-to-image-1.jpg' },
    { id: 4, title: 'ALTERNATIVE POSTER', image: 'link-to-image-2.jpg' },
    { id: 5, title: 'NAME HERE', image: 'link-to-image-1.jpg' },
  ];

  return (
    <div className="landing-page-container">
      {/* Sökfältet - visas bara här på Main-sidan */}
      <div className="search-section">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Filter sektion */}
      <div className="filter-section">
        <button className="filter-btn main-filter">filter.... <span>⬇️</span></button>
        <button className="filter-btn date-filter">Datum <span>⬇️</span></button>
      </div>

      {/* Grid med filmkort */}
      <main className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="poster-container">
              <div className="poster-placeholder" style={{ backgroundImage: `url(${movie.image})` }}>
                <div className="poster-overlay-text">
                  <h3>{movie.title}</h3>
                  <p>Director: Name</p>
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

export default MovieGallery;