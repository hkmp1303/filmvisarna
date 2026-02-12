import { useState, useEffect } from 'react';
import fetchData from '../util/fetchData';
import { useParams } from 'react-router-dom';
import '../css/MovieDetails.css';

interface Film {
    filmid: number;
    title: string;
    duration: number;
    trailer: string;
    description: string;
    details: Filmdetails;
    genre: string;
    viewerRating: BinaryType;

}
interface Filmdetails {
    actor: string;
    director: string;
    release_year: string;
    production_company: string;
    production_counrty: string;
}

export default function MovieDetails() {
    const { filmid } = useParams();
    const [film, setfilm] = useState<Film | null>(null);
    const [date, setDate] = useState('');

    useEffect(() => {
        const getFilm = async () => {
            const data = await fetchData<Film>(`api/film/${filmid}`);
            setfilm(data);
        }
        getFilm();
    }, [filmid]);

    return film && <>
        <article className="movie-details-container">
            <section className="movie-title">
                <h1>{film.title}</h1>
                <div className="movie-info">
                    <h2>Åldersgräns: {film.viewerRating}</h2>
                    <h2>Länged: {film.duration}</h2>
                    <h2>Genre: {film.genre}</h2>
                </div>
            </section>
            <div className="colum1-container">
                <div className="trailer-container">
                    <h2>Trailer</h2>
                    <iframe src="https://www.youtube.com/embed/ZDlYxy69R3A?si=mSlEj8VkAXaEjGk4" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"   ></iframe>
                </div>
                <div className="date-picker">
                    <label htmlFor="start">Välj datum: </label>
                    <input
                        type="date"
                        id="start"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <p>Valt datum: {date}</p>
                </div>
                <button className="btn-booking">Boka biljetter</button>
            </div>
            <div className="colum2-container">
                <section className="movie-description">
                    <h3>About the movie:</h3>
                    <p>{film.description}</p>
                </section>
                <section className="movie-cast">
                    <h3>Cast</h3>
                    <p>{film.details.director}</p>
                    <p>{film.details.actor}</p>
                    <p>{film.details.production_company}</p>
                    <p>{film.details.production_counrty}</p>
                    <p>{film.details.release_year}</p>
                </section>
            </div>
        </article>
    </>
}