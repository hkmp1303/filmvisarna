import { useState } from "react"
import { useNavigate } from "react-router-dom";


export default function PasswordRecovery() {
    const navigate = useNavigate();
    const [btnToggle, setBtnToggle] = useState<boolean>(false);

    return (
        <article>
            {
                btnToggle ? (
                    <section>
                        <h2>Ditt lösenord är nu återställt</h2>
                        <br />
                        <p>Ett mail med ett nytt lösenord har nu skickats till din e-mail.</p>
                        <button onClick={() => setBtnToggle(false)}>Tillbaka</button>
                    </section>
                ) : (
                    <section>
                        <h2>Glömt lösenord</h2>
                        <label>Skriv in din e-mail:</label>
                        <input type="email" />
                        <button onClick={() => setBtnToggle(true)}>Återställ lösenord</button>
                        <button onClick={() => navigate('/Login')}>Tillbaka</button>
                    </section>

                )}
        </article>
    );
}