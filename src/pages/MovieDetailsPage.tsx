import { useState } from "react";
import '../css/MovieDetails.css';

export default function MovieDetails() {

    /* */
    const [date, setDate] = useState('');

    return <>
        <article className="movie-details-container">
            <section className="movie-title">
                <h1>Title of the movie</h1>
                <h2>Åldersgräns: xxx länged: xxx Genre: xxx</h2>
            </section>
            <div className="colum1-container">
                <div className="trailer-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/ZDlYxy69R3A?si=mSlEj8VkAXaEjGk4" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"   ></iframe>
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
                    <p>long text about the movie and what it is about</p>
                    <p>long text about the movie and what it is about</p>
                    <p>long text about the movie and what it is about</p>
                    <p>long text about the movie and what it is about</p>
                    <p>long text about the movie and what it is about</p>
                </section>
                <section className="movie-cast">
                    <h3>Cast</h3>
                    <p>some actor</p>
                    <p>some actor</p>
                    <p>some actor</p>
                    <p>some actor</p>
                    <p>some actor</p>
                </section>
            </div>
        </article>
    </>
}