
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchJson from '../utilities/useFetchJson';
import { sortAndFilterMovies } from '../utilities/movieUtils';
import type { SortOption } from "../utilities/types";
import { sortViewerRating, type BriefFilm } from '../utilities/filmInterface';
import '../css/LandingPage.css';
import { displayVeiwerRating, displayGenre } from '../utilities/i18n';
import { formatDateIso, formatDayMonth } from '../utilities/formatDateTime';
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

  const handleSortChange = (e: any, key: SortOption) => {
    setSortBy(key);
    setSortLabel(e.currentTarget.innerHTML);
    closeDrop(e);
  };

  // extract movie genre from movie list
  const uniqueGenres = Array.from(
    new Set(movies.map((m) => m.genre).filter(Boolean))
  ).sort((a, b) => displayGenre(a) > displayGenre(b) ? 1 : -1);

  const uniqueRatings = Array.from(
    new Set(movies.map((m) => m.viewer_rating).filter(Boolean))
  ).sort(sortViewerRating);

  const openDrop = (e: any) => e.currentTarget.open = true;
  const closeDrop = (e: any) => {
    if (e.currentTarget.open)
      e.currentTarget.open = false;
    if (e.currentTarget.parentElement.parentElement.open)
      e.currentTarget.parentElement.parentElement.open = false;
  }

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
        <details className="dropdown" onMouseEnter={openDrop} onMouseLeave={closeDrop}>
          <summary className="filter-btn dropdown-btn">
            Sortera: {sortLabel} ▼
          </summary>
          <div className="dropdown-content">
            <a onClick={(e: any) => handleSortChange(e, 'title_asc')}>Titel (A-Ö)</a>
            <a onClick={(e: any) => handleSortChange(e, 'title_desc')}>Titel (Ö-A)</a>
            <a onClick={(e: any) => handleSortChange(e, 'newest')}>Premiär (Nyast)</a>
            <a onClick={(e: any) => handleSortChange(e, 'oldest')}>Premiär (Äldst)</a>
            <a onClick={(e: any) => handleSortChange(e, 'duration_asc')}>Speltid (Kortast)</a>
            <a onClick={(e: any) => handleSortChange(e, 'duration_desc')}>Speltid (Längst)</a>
          </div>
        </details>
        <details className="dropdown" onMouseEnter={openDrop} onMouseLeave={closeDrop}>
          <summary className="filter-btn dropdown-btn">
            {selectedGenre === '' ? 'Alla Genrer' : displayGenre(selectedGenre)} ▼
          </summary>
          <div className="dropdown-content">
            <a onClick={(e: any) => { setSelectedGenre(''); closeDrop(e) }}>Alla Genrer</a>
            {uniqueGenres.map((genre) => (
              <a key={genre} onClick={(e: any) => { setSelectedGenre(genre); closeDrop(e); }}>
                {displayGenre(genre)}
              </a>
            ))}
          </div>
        </details>
        <details className='dropdown' onMouseEnter={openDrop} onMouseLeave={closeDrop}>
          <summary className='filter-btn dropdown-btn'>
            {selectedRating === '' ? 'Alla Åldrar' : displayVeiwerRating(selectedRating)} ▼
          </summary>
          <div className='dropdown-content'>
            <a onClick={(e: any) => { setSelectedRating(''); closeDrop(e) }}>Alla Ålder</a>
            {uniqueRatings.map((viewer_rating) => (
              <a key={viewer_rating} onClick={(e: any) => { setSelectedRating(viewer_rating); closeDrop(e); }}>
                {displayVeiwerRating(viewer_rating)}
              </a>
            ))}
          </div>
        </details>
        <details className='dropdown' onMouseEnter={openDrop} onMouseLeave={closeDrop}>
          <summary className='filter-btn dropdown-btn'>
            {selectedScreeningDay === '' ? 'Alla Datum' : formatDayMonth(selectedScreeningDay)} ▼
          </summary>
          <div className='dropdown-content'>
            <a onClick={(e: any) => { setSelectedScreeningDay(''); closeDrop(e) }}>Alla Dagar</a>
            {Object.keys(Week).map((start, index) => (
              <a key={index} onClick={(e: any) => { setSelectedScreeningDay(start); closeDrop(e); }}>
                {formatDayMonth(start)}
              </a>
            ))}
          </div>
        </details>
      </div>
      {/* Movie Grid */}
      <main className="movie-grid">
        {displayMovies.map((movie) => (
          <div key={movie.filmid} className="movie-card">
            <button
              className="details-btn"
              onClick={() => selectedMovieNavigation(movie.filmid)}
            >
              <div className="poster-container">
                <div
                  className="poster-placeholder"
                  style={{ backgroundImage: `url(${movie.cover_image ?? ''})` }}
                >
                </div>
              </div>
              <div className="poster-overlay-text card-info">
                <h3>{movie.title}</h3>
                <p>{movie.duration} min | {displayGenre(movie.genre)} | {movie.language}</p>
              </div>
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}