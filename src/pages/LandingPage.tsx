import useFetchJson from '../utilities/useFetchJson.ts';
import '../css/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import type { Film } from '../utilities/filmInterface.ts';

export default function LandingPage() {
  const navigate = useNavigate();

  // Custoom hook from utilities pendin if we want to do it this way
  const films = useFetchJson<Film[]>('/api/film');

  const selectedMovieNavigation = (filmid: number) => {
    navigate(`/moviedetails/${filmid}`)
  };

  if (!films) {
    return <div style={{ color: 'white' }}>Laddar filmer...</div>;
  }

  // 3. Filtrer
  const featuredMovieIds = [1, 3, 5];
  const selectedMovies = films.filter((film) =>
    featuredMovieIds.includes(film.filmid)
  );


  return films && (
    <div className="landing-page-container">
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
        {selectedMovies.map((film) => (
          <div key={film.filmid} className="movie-card">
            <div className="poster-container">
              <div
                className="poster-placeholder"
                style={{ backgroundImage: `url(/moviePoster/${film.filmid}.png)` }}
              >
                <div className="poster-overlay-text">
                  <h3>{film.title}</h3>
                  <p>{film.duration} min | {film.language}</p>
                </div>
              </div>
            </div>
            <div className="card-info">
              <p className="movie-name">{film.title}</p>
              <button
                className="details-btn"
                onClick={() => selectedMovieNavigation(film.filmid)}
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