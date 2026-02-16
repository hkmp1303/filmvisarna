//import { useState } from 'react'

import '../css/ContactPage.css'

//const [name, setName] = useState();
//const [email, setEmail] = useState();
//const [question, setQuestion] = useState();
//const [message, setMessage] = useState();

export default function Contact() {

    return <article className='contact-page'>
        <section className='info-container'>
            <h1>Kontakta oss</h1>
            <h3>Adress:</h3>
            <p>Storgatan 12</p>
            <p>123 45 Filmstad</p>
            <p>Sverige</p>
            <h3>Telefon:</h3>
            <p>01-000000000</p>
            <h3>E-mail:</h3>
            <p>info@filmvisarna.fake</p>
            <h3>Öppettider:</h3>
            <p>Måndag - Fredag: 13:00 - 23:00</p>
            <p>Lördag - Söndag: 10:00 - 00:00</p>

        </section>
        <section className='form-container'>
            <div className='form-box'>
                <form action=""></form>
                <label> Namn: </label>
                <input className='input-field' type="text" />
                <label> E-mail: </label>
                <input className='input-field' type="text" />
                <select name="" id="">
                    <option value="">Ärende</option>
                    <option value="">Föreställning</option>
                    <option value="">Biljettfråga</option>
                    <option value="">Kiosken</option>
                    <option value="">Betalning</option>
                    <option value="">Övrigt</option>
                </select>
                <label htmlFor="">Skriv
                </label>
                <textarea></textarea>
                <input type="submit" className='submit-btn' />
            </div>
        </section>
    </article>
}