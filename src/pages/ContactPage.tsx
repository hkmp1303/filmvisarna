import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react';

import '../css/ContactPage.css'

interface contactForm {
    name: string;
    email: string;
    subject: 'None' | 'Föreställning' | 'Biljettfråga' | 'Kiosken' | 'Betalning' | 'Övrigt' | string;
    message: string;
}

export default function Contact() {

    const [submitData, setSubmitData] = useState<contactForm>({
        name: '',
        email: '',
        subject: 'None',
        message: '',
    });

    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleData = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSubmitData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //change here if we're gonna do it as an emil or as an internal message system????
        console.log('Skickar data:', submitData);

        setSubmitted(true);

        //const nativeEvent = e.nativeEvent as SubmitEvent;
        setSubmitted(true);
    }

    return <article className='contact-page'>

        {submitted && (
            <div className='popup-window'>
                <div className='popup-content'>
                    <h3> Tack, {submitData.name}!</h3>
                    <p>Ditt meddelande har nu skickats till oss.</p>
                    <p>Vi hör av oss så snart vi kan.</p>
                    <button onClick={() => setSubmitted(false)}>Stäng</button>
                </div>
            </div>
        )}
        <section className='info-container'>
            <h1>Kontakta oss</h1>
            <h3>Adress:</h3>
            <p>Storgatan 12</p>
            <p>123 45 Småstad</p>
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
            <form onSubmit={handleSubmit}>
                <br />
                <label> Namn: </label>
                <input name='name' value={submitData.name} className='input-field' type="text" onChange={handleData} required />
                <br />
                <label> E-mail: </label>
                <input name='email' value={submitData.email} className='input-field' type="email" onChange={handleData} required />
                <select name="subject" value={submitData.subject} onChange={handleData}>
                    <option value="None">Ärende</option>
                    <option value="Föreställning">Föreställning</option>
                    <option value="Biljettfråga">Biljettfråga</option>
                    <option value="Kiosken">Kiosken</option>
                    <option value="Betalning">Betalning</option>
                    <option value="Övrigt">Övrigt</option>
                </select>
                <label htmlFor="">Skriv ett meddelande:
                </label>
                <textarea name='message' value={submitData.message} onChange={handleData} required></textarea>
                <button className='submit-btn' type='submit'> Skicka</button>
            </form>
        </section>
    </article>
}