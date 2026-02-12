import { useNavigate } from 'react-router-dom';
import useFetchJson from '../utilities/useFetchjson';
import '../css/LandingPage.css';

interface Movie {
  filmid: number;
  title: string;
  duration: number;
  language: string;
  cover_image: string;
  description: string;
}

export default function LandingPage() {
  const navigate = useNavigate();

  // Custoom hook from utilities pendin if we want to do it this way
  const movies = useFetchJson<Movie[]>('/api/film');

  if (!movies) {
    return <div style={{ color: 'white' }}>Laddar filmer...</div>;
  }

  // 3. Filtrer
  const featuredMovieIds = [1, 3, 5];
  const selectedMovies = movies.filter((movie) =>
    featuredMovieIds.includes(movie.filmid)
  );

  return (
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
        {selectedMovies.map((movie) => (
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
                onClick={() => navigate(`/film/`)}
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