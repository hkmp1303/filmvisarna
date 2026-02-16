import { useState } from 'react'

import '../css/ContactPage.css'

const [data, setData] = useState();

export default function Contact() {

    return <article>
        <form action=""></form>
        <label> Namn
            <input type="text" />
        </label>
        <select name="" id="">
            <option value="">Välja ämne som det handlar om</option>
            <option value="">ämne 1</option>
            <option value="">ämne 2</option>
            <option value="">ämne 3</option>
        </select>
        <label htmlFor="">Skriv
            <textarea name="" id=""></textarea>
        </label>
    </article>
}