import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleReset = async () => {
        const token = searchParams.get("token");

        const response = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password })
        });

        if (response.ok) {
            alert("Lösenordet är ändrat! Du kan nu logga in.");
            navigate("/login");
        } else {
            alert("Något gick fel. Länken kan vara för gammal.");
        }
    };

    return (
        <article>
            <div>
                <h2>Välj ett nytt lösenord</h2>
                <input
                    type="password"
                    placeholder="Nytt lösenord"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleReset}>Spara lösenord</button>
            </div>
        </article>
    );
}