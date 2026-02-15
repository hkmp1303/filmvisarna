
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchJson from '../utilities/useFetchJson';
import '../css/LandingPage.css';

interface Movie {
  filmid: number;
  title: string;
  duration: number;
  language: string;
  cover_image: string;
  description: string;
  details: string;
}

type SortOption = 'title_asc' | 'title_desc' | 'newest' | 'oldest' | 'duration_asc' | 'duration_desc';

export default function LandingPage() {
  const navigate = useNavigate();

  // Custoom hook from utilities pendin if we want to do it this way

  const movies = useFetchJson<Movie[]>('/api/film');
  const [sortBy, setSortBy] = useState<SortOption>('title_asc');
  const [sortLabel, setSortLabel] = useState('Titel (A-Ö)');


  const selectedMovieNavigation = (filmid: number) => {
    navigate(`/moviedetails/${filmid}`);
  };

  if (!movies) {
    return <div style={{ color: 'white' }}>Laddar filmer...</div>;
  }
  const sortedMovies = [...movies].sort((a, b) => {
    const getYear = (m: Movie) => {
      try {
        const d = typeof m.details === 'string' ? JSON.parse(m.details) : m.details;
        return parseInt(d?.release_year) || 0;
      } catch { return 0; }
    };

    switch (sortBy) {
      case 'title_asc': return a.title.localeCompare(b.title);
      case 'title_desc': return b.title.localeCompare(a.title);
      case 'newest': return getYear(b) - getYear(a);
      case 'oldest': return getYear(a) - getYear(b);
      case 'duration_asc': return a.duration - b.duration;
      case 'duration_desc': return b.duration - a.duration;
      default: return 0;
    }
  });
  // 3. Filtrer
  const featuredMovieIds = [1, 3, 5];

  const displayMovies = sortedMovies.filter((movie) =>
    featuredMovieIds.includes(movie.filmid)
  );

  const handleSortChange = (key: SortOption, label: string) => {
    setSortBy(key);
    setSortLabel(label);
  };


  return (

    <div className="landing-page-container">
      <div className="search-section">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="filter-section">

        <button className="filter-btn date-filter">Datum</button>

        <div className="dropdown">
          <button className="filter-btn dropdown-btn">
            Sortera: {sortLabel} ▼
          </button>
          <div className="dropdown-content">
            <a onClick={() => handleSortChange('title_asc', 'Titel (A-Ö)')}>Titel (A-Ö)</a>
            <a onClick={() => handleSortChange('title_desc', 'Titel (Ö-A)')}>Titel (Ö-A)</a>
            <a onClick={() => handleSortChange('newest', 'Premiär (Nyast)')}>Premiär (Nyast)</a>
            <a onClick={() => handleSortChange('oldest', 'Premiär (Äldst)')}>Premiär (Äldst)</a>
            <a onClick={() => handleSortChange('duration_asc', 'Speltid (Kortast)')}>Speltid (Kortast)</a>
            <a onClick={() => handleSortChange('duration_desc', 'Speltid (Längst)')}>Speltid (Längst)</a>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <main className="movie-grid">

        {displayMovies.map((movie) => (
          <div key={movie.filmid} className="movie-card">


            <div className="poster-container">
              <div
                className="poster-placeholder"
                style={{ backgroundImage: `url(/moviePoster/${movie.filmid}.png)` }}
              >
                <div className="poster-overlay-text">
                  <h3>{movie.title}</h3>
                  <p>{movie.duration} min | {movie.language}</p>
                </div>
              </div>
            </div>
            <div className="card-info">
              <p className="movie-name">{movie.title}</p>
              <button
                className="details-btn"
                onClick={() => selectedMovieNavigation(movie.filmid)}
              >
                Detaljer
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}