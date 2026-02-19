import { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/MovieDetails.css';
import useFetchJson from '../utilities/useFetchJson';
import type { Film, Actor } from '../utilities/filmInterface';
import type { Screening } from '../utilities/screeningInterface';
import { formatDateTime } from '../utilities/formatDateTime';


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

    return film && (<>
        <article className="movie-details-container">
            <section className="movie-title">
                <h1>{film.title}</h1>
                <div className="movie-info">
                    <h2>Åldersgräns: {viewrating}</h2>
                    <h2>Längd: {hours} tim {minutes} min</h2>
                    <h2>Genre: {film.genre}</h2>
                </div>
            </section>
            <div className="colum1-container">
                <div className="trailer-container">
                    <iframe src={film.trailer+"&amp;controls=0&amp;modestbranding=0&amp;rel=0"} title="Trailer videospelare" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
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
                    {film.details && !!film.details.director && (<>
                    <h3>Regissör:</h3>
                        <p>{film.details.director}</p></>)}
                    {film.details && film.details.actor  && film.details.actor.length > 0 && (<>
                    <h3>Skådespelare:</h3>
                        {film.details.actor.map((a: Actor) => (<p>{a.name}</p>))}</>)}
                    <h3>Språk:</h3>
                    <p>{film.language}</p>
                    <h3>Undertext:</h3>
                    <p>{film.subtitle_language}</p>
                    {film.details && !!film.details.production_company && (<>
                    <h3>Produktionsbolag:</h3>
                      <p>{film.details.production_company}</p></>)}
                    {film.details && !!film.details.production_counrty && (<>
                    <h3>Produktionsland:</h3>
                      <p>{film.details.production_counrty}</p></>)}
                    {film.details && !!film.details.release_year && (<>
                    <h3>Produktionsår:</h3>
                    <p>{film.details.release_year}</p></>)}
                </section>
            </div>
        </article>
    </>)
}

