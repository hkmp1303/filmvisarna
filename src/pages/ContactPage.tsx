import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react';
import fetchJson from '../utilities/fetchJson';
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await fetchJson('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (data && !data.error) {
                setSubmitted(true);
                setSubmitData({ name: '', email: '', subject: 'None', message: '' });
            } else {
                alert("Något gick fel" + (data.error || "Okänt fel"));
            }
        } catch (error) {
            console.error("Kunde inte kontakta servern:", error);
            alert("Kunde inte ansluta till servern")
        }
        setSubmitted(true);
    }

    return <article className='contact-page'>

        {submitted && (
            <div className='popup-window'>
                <div className='popup-content'>
                    <h3 className='text-2xl'> Tack, {submitData.name}!</h3>
                    <p className='text-xl'>Ditt meddelande har nu skickats till oss.</p>
                    <p className='text-xl'>Vi hör av oss så snart vi kan.</p>
                    <button onClick={() => setSubmitted(false)}>Stäng</button>
                </div>
            </div>
        )}
        <section className='info-container'>
            <h1 className='contact-text'>Kontakta oss</h1>
            <h3 className='text-2xl font-semibold'>Adress:</h3>
            <p className='text-xl'>Storgatan 12</p>
            <p className='text-xl'>123 45 Småstad</p>
            <p className='pb-10 text-xl'>Sverige</p>
            <h3 className='text-2xl font-semibold'>Telefon:</h3>
            <p className='pb-10 text-xl'>01-000000000</p>
            <h3 className='text-2xl font-semibold'>E-mail:</h3>
            <p className='pb-10 text-xl'>info@filmvisarna.fake</p>
            <h3 className='text-2xl font-semibold'>Öppettider:</h3>
            <p className='text-xl'>Måndag - Fredag: 13:00 - 23:00</p>
            <p className='pb-10 text-xl'>Lördag - Söndag: 10:00 - 00:00</p>

        </section>
        <section className='form-container'>
            <form onSubmit={handleSubmit}>
                <br />
                <label className='text-xl font-semibold mb-2'> Namn: </label>
                <input name='name' value={submitData.name} className='input-field' type="text" onChange={handleData} required />
                <br />
                <label className='text-xl font-semibold mb-2 mt-1'> E-mail: </label>
                <input name='email' value={submitData.email} className='input-field' type="email" onChange={handleData} required />
                <select className='text-base' name="subject" value={submitData.subject} onChange={handleData}>
                    <option value="None">Ärende</option>
                    <option value="Föreställning">Föreställning</option>
                    <option value="Biljettfråga">Biljettfråga</option>
                    <option value="Kiosken">Kiosken</option>
                    <option value="Betalning">Betalning</option>
                    <option value="Övrigt">Övrigt</option>
                </select>
                <label className='text-xl font-semibold mb-2 mt-1'>Skriv ett meddelande:
                </label>
                <textarea name='message' value={submitData.message} onChange={handleData} required></textarea>
                <button className='submit-btn' type='submit'> Skicka</button>
            </form>
        </section>
    </article>
}