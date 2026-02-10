import { useState } from "react";

export default function MovieDetails() {

    /* */
    const [date, setDate] = useState('');

    return <>
        <article>
            <section className="movie-title">
                <h1>Title of the movie</h1>
                <h2>Åldersgräns: xxx länged: xxx Genre: xxx</h2>
            </section>
            <video src=""></video>
            <div>
                <label htmlFor="start">Välj datum: </label>
                <input
                    type="date"
                    id="start"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <p>Valt datum: {date}</p>
            </div>
            <button>Boka biljetter</button>
            <section className="movie-description">
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
        </article>
    </>
}