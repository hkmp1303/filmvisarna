
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchJson from '../utilities/useFetchJson';
import { sortAndFilterMovies } from '../utilities/movieUtils';
import type { SortOption } from "../utilities/types";
import type { BriefFilm } from '../utilities/filmInterface';
import '../css/LandingPage.css';
import translateGenre from '../utilities/i18n';
import { displayVeiwerRating } from '../utilities/i18n';


export default function LandingPage() {
  const navigate = useNavigate();



  const movies = useFetchJson<BriefFilm[]>('/api/film');
  const [sortBy, setSortBy] = useState<SortOption>('title_asc');
  const [sortLabel, setSortLabel] = useState('Titel (A-Ö)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const selectedMovieNavigation = (filmid: number) => {
    navigate(`/moviedetails/${filmid}`);
  };

  if (!movies) {
    return <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
      <svg
        className="animate-spin h-10 w-10 text-purple-500 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className='text-white text-lg font-semibold animate-pulse'>
        Laddar filmer...
      </p>
    </div>
      ;
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