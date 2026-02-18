import { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/MovieDetails.css';
import useFetchJson from '../utilities/useFetchJson.ts';
import type { Film } from '../utilities/filmInterface.ts';
import type { Screening } from '../utilities/screeningInterface.ts';
import { formatDateTime } from '../utilities/formatDateTime.ts';


export default function MovieDetails() {
    const { filmid } = useParams();
    const [date, setDate] = useState('');

    const film = useFetchJson<Film>(`/api/film/${filmid}`);
    const screenings = useFetchJson<Screening[]>(`/api/selectScreening/film/${filmid}`);

    let viewrating: string;

    switch (film?.viewer_rating) {
        case 'bfj':
            viewrating = 'Barnförbjuden'
            break;
        case 'btl':
            viewrating = 'Barntillåten'
            break;
        case '7+':
            viewrating = '7+ år'
            break;
        case '11+':
            viewrating = '11+ år'
            break;
        case '15+':
            viewrating = '15+ år'
            break;
        default:
            viewrating = 'Ingen Åldersgräns satt'
            break;
    }

    if (!film) {
        return <div style={{ color: 'white', padding: '20px' }}>Laddar filmdetaljer...</div>;
    }

    const hours = Math.floor(film.duration / 60);
    const minutes = film.duration % 60;

    return film && <>
        <article className="movie-details-container">
            <section className="movie-title">
                <h1>{film.title}</h1>
                <div className="movie-info">
                    <h2>Åldersgräns: {viewrating}</h2>
                    <h2>Länged: {hours} tim {minutes} min</h2>
                    <h2>Genre: {film.genre}</h2>
                </div>
            </section>
            <div className="colum1-container">
                <div className="trailer-container">
                    <iframe src={film.trailer} title="Trailer video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"   ></iframe>
                </div>
                <div className="date-picker">
                    {screenings && screenings.length > 0 ? (
                        <select value={date} onChange={(e) => setDate(e.target.value)}>
                            <option value="">Välj en tid</option>
                            {screenings.map((s, index) => (
                                <option key={index} value={s.start}>
                                    {formatDateTime(s.start)} - {s.description}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>Finns inga visningar</p>
                    )}
                    <p>Vald tid: {date ? formatDateTime(date) : " "}</p>
                </div>
                <button className="btn-booking">Boka biljetter</button>
            </div>
            <div className="colum2-container">
                <section className="movie-description">
                    <h3>Handling:</h3>
                    <p>{film.description}</p>
                </section>
                <section className="movie-cast">
                    <h3>Regissör:</h3>
                    <p>{film.details.director}</p>
                    <h3>Skådespelare:</h3>
                    <p>{film.details.actor}</p>
                    <h3>Orginal språk:</h3>
                    <p>{film.language}</p>
                    <h3>Undertext:</h3>
                    <p>{film.subtitle_language}</p>
                    <h3>Produktionsbolag:</h3>
                    <p>{film.details.production_company}</p>
                    <h3>Produktions land:</h3>
                    <p>{film.details.production_counrty}</p>
                    <h3>Produktions år:</h3>
                    <p>{film.details.release_year}</p>
                </section>
            </div>
        </article>
    </>
}

