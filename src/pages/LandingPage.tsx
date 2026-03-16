
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchJson from '../utilities/useFetchJson';
import { sortAndFilterMovies } from '../utilities/movieUtils';
import type { SortOption } from "../utilities/types";
import { sortViewerRating, type BriefFilm } from '../utilities/filmInterface';
import '../css/LandingPage.css';
import { displayVeiwerRating, displayGenre } from '../utilities/i18n';
import { formatDateIso, formatDay, formatDayMonth } from '../utilities/formatDateTime';
import { ThemedayToggle } from '../utilities/ThemedayToggle';
import { useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const movies = useFetchJson<BriefFilm[]>('/api/films');
  const [sortBy, setSortBy] = useState<SortOption>('title_asc');
  const [sortLabel, setSortLabel] = useState('Titel (A-Ö)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedScreeningDay, setSelectedScreeningDay] = useState('');


  useEffect(() => {
    const savedTheme = sessionStorage.getItem('savedTheme');
    if (savedTheme) {
      setSelectedGenre(savedTheme);
      ThemedayToggle(savedTheme);
    }
  }, []);

  useEffect(() => {
    ThemedayToggle(selectedGenre);
  }, [selectedGenre]);

  const Now = Math.floor(Date.now() / 1000); // Unix timestamp format
  const Week: Record<string, string> = {};
  for (let i = 0; i <= 7; i++) {
    let tmp = new Date((Now + (i * 60 * 60 * 24)) * 1000);
    let key = formatDateIso(tmp.toISOString()); // date only from DateTime
    Week[key] = tmp.toISOString().substring(0, 19); // exclude milliseconds
  }

  const selectedMovieNavigation = (filmid: number) => {
    navigate(`/moviedetails/${filmid}`);
  };

  if (!movies) {
    return <div style={{ color: 'white' }}>Laddar filmer...</div>;
  }
  const displayMovies = sortAndFilterMovies(movies, sortBy, searchQuery, selectedGenre, selectedRating, selectedScreeningDay);

  const handleSortChange = (key: SortOption, label: string) => {
    setSortBy(key);
    setSortLabel(label);
  };

  // extract movie genre from movie list
  const uniqueGenres = Array.from(
    new Set(movies.map((m) => m.genre).filter(Boolean))
  ).sort((a, b) => displayGenre(a) > displayGenre(b) ? 1 : -1);

  const uniqueRatings = Array.from(
    new Set(movies.map((m) => m.viewer_rating).filter(Boolean))
  ).sort(sortViewerRating);

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
            {selectedGenre === '' ? 'Alla Genrer' : displayGenre(selectedGenre)} ▼
          </button>
          <div className="dropdown-content">
            <a onClick={() => setSelectedGenre('')}>Alla Genrer</a>
            {uniqueGenres.map((genre) => (
              <a key={genre} onClick={() => setSelectedGenre(genre)}>
                {displayGenre(genre)}
              </a>
            ))}
          </div>
        </div>
        <div className='dropdown'>
          <button className='filter-btn dropdown-btn'>
            {selectedRating === '' ? 'Alla Åldrar' : displayVeiwerRating(selectedRating)} ▼
          </button>
          <div className='dropdown-content'>
            <a onClick={() => setSelectedRating('')}>Alla Ålder</a>
            {uniqueRatings.map((viewer_rating) => (
              <a key={viewer_rating} onClick={() => setSelectedRating(viewer_rating)}>
                {displayVeiwerRating(viewer_rating)}
              </a>
            ))}
          </div>
        </div>
        <div className='dropdown'>
          <button className='filter-btn dropdown-btn'>
            {selectedScreeningDay === '' ? 'Alla Datum' : formatDayMonth(selectedScreeningDay)} ▼
          </button>
          <div className='dropdown-content'>
            <a onClick={() => setSelectedScreeningDay('')}>Alla Dagar</a>
            {Object.keys(Week).map((start, index) => (
              <a key={index} onClick={() => setSelectedScreeningDay(start)}>
                {formatDayMonth(start)}
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
                  <p>{movie.duration} min | {displayGenre(movie.genre)}| {movie.language}</p>
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