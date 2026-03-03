import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import '../css/ResetPassword.css';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const [changed, setChanged] = useState<boolean>(false);

    const handleReset = async () => {
        const token = searchParams.get("token");

        if (password !== confirmPassword) {
            alert("Lösenord matchar inte.")
            return;
        }

        const response = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password })
        });

        if (response.ok) {
            setChanged(true);
        }
        else {
            alert("Något gick fel. Länken kan vara för gammal.");
        }
    };

    const closeAndNav = () => {
        setChanged(false);
        navigate("/login");
    };

    return (
        <article className="reset-page">
            {changed && (
                <div className='popup-window'>
                    <div className='popup-content'>
                        <h3 className='text-2xl'>Ditt lösenord är nu ändrat</h3>
                        <p className='text-xl'>Du kommer nu omdirigeras till inloggningssidan</p>
                        <button onClick={closeAndNav}>Stäng</button>
                    </div>
                </div>
            )}
            <div className="reset-container">
                <h2 className="text-2xl mb-8">Välj ett nytt lösenord</h2>
                <input
                    className="reset-input"
                    type="password"
                    placeholder="Nytt lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="reset-input mt-4"
                    type="password"
                    placeholder="Bekräfta lösenord"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="reset-btn" onClick={handleReset}>Spara lösenord</button>
            </div>
        </article>
    );
}