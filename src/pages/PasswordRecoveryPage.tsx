import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../css/PasswordRecoveryPage.css';


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
            alert("Ett fel har inträffat. Försök igen senare.");
        }
    };

    return (
        <article className="pr-art">
            {
                btnToggle ? (
                    <section>
                        <h2>Ditt lösenord är nu återställt</h2>
                        <div className="pass-send-container">
                            <p className="text-2xl">Ett mejl med instruktioner för att återställa ditt lösenord har skickats till din e-post</p>
                            <button onClick={() => setBtnToggle(false)}>Tillbaka</button>
                        </div>
                    </section>
                ) : (

                    <section>
                        <h2>Glömt lösenord</h2>
                        <div className="recover-pass-container">
                            <label className="text-2xl">Skriv in din e-mail:</label>
                            <input className="recovery-input" type="email" ref={emailRef} />
                            <button className="recover-btn" onClick={handleRecovery}>Återställ lösenord</button>
                            <button className="recover-btn" onClick={() => navigate('/Login')}>Tillbaka</button>
                        </div>
                    </section>

                )}
        </article>
    );
}