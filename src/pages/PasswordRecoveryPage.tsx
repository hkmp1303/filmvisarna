import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom";


export default function PasswordRecovery() {
    const navigate = useNavigate();
    const [btnToggle, setBtnToggle] = useState<boolean>(false);
    const emailRef = useRef<HTMLInputElement>(null);

    const handleRecovery = async () => {
        const email = emailRef.current?.value;

        if (!email) {
            alert("Vänligen fyll i din e-post");
            return;
        }

        const response = await fetch("/api/recoverpassword", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            setBtnToggle(true);
        } else {
            alert("Kunde inte återställa lösenord. Kontrollera e-postadressen.");
        }
    };

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
                        <input type="email" ref={emailRef} />
                        <button onClick={handleRecovery}>Återställ lösenord</button>
                        <button onClick={() => navigate('/Login')}>Tillbaka</button>
                    </section>

                )}
        </article>
    );
}