
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchJson from '../utilities/useFetchJson';
import { sortAndFilterMovies } from '../utilities/movieUtils';
import type { SortOption } from "../utilities/types";
import type { BriefFilm } from '../utilities/filmInterface';
import '../css/LandingPage.css';
import translateGenre from '../utilities/i18n';
import { displayVeiwerRating } from '../utilities/i18n';
import { ThemedayToggle } from '../utilities/ThemedayToggle';
import { useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();



  const movies = useFetchJson<BriefFilm[]>('/api/film');
  const [sortBy, setSortBy] = useState<SortOption>('title_asc');
  const [sortLabel, setSortLabel] = useState('Titel (A-Ö)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {

    ThemedayToggle(selectedGenre || 'default');

    return () => ThemedayToggle('default');
  }, [selectedGenre]);

  const selectedMovieNavigation = (filmid: number) => {
    navigate(`/moviedetails/${filmid}`);
  };

  if (!movies) {
    return <div style={{ color: 'white' }}>Laddar filmer...</div>;
  }
  const displayMovies = sortAndFilterMovies(movies, sortBy, searchQuery, selectedGenre);

  const handleSortChange = (key: SortOption, label: string) => {
    setSortBy(key);
    setSortLabel(label);
  };

  const uniqueGenres = Array.from(
    new Set(movies.map((m) => m.genre).filter(Boolean))
  ).sort();


  return (
    <div className="landing-page-container">
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Sök titel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="filter-section">
        {/* <button className="filter-btn date-filter">Datum</button> */}
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
        <div className="dropdown">
          <button className="filter-btn dropdown-btn">
            {selectedGenre === '' ? 'Alla Genrer' : translateGenre(selectedGenre)} ▼
          </button>
          <div className="dropdown-content">
            <a onClick={() => setSelectedGenre('')}>Alla Genrer</a>
            {uniqueGenres.map((genre) => (
              <a key={genre} onClick={() => setSelectedGenre(genre)}>
                {translateGenre(genre)}
              </a>
            ))}
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
                style={{ backgroundImage: `url(${movie.cover_image ?? ''})` }}
              >
                <div className="poster-overlay-text">
                  <h3>{movie.title}</h3>
                  <p>{movie.duration} min | {translateGenre(movie.genre)}| {movie.language}</p>
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