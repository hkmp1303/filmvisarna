import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { User } from '../utilities/types'; // Se till att denna finns!
import '../css/Login.css';

interface LoginContext {
  setUser: (user: User | null) => void;
}

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext<LoginContext>(); // Hämta global funktion

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data); // Uppdatera App.tsx state
      navigate('/'); // Gå till startsidan
    } else {
      setError("Fel e-post eller lösenord");
    }
  };

  return (
    <div className="login-container">
      <div className="login-big-text">
        <h1>Logga In</h1>
      </div>

      <div className="login-input">
        {error && <p className="error-message">{error}</p>}

        <div className="email-input">
          <p>E-post</p>
          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="Password-input">
          <p>Lösenord</p>
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="forgotten-password">
          <button className="forgoten-password-btn">Glömt lösenord?</button>
        </div>

        <div className="confirm">
          <button className="confirm-btn" onClick={handleLogin}>Logga In</button>
        </div>

        <div className="forgotten-password">
          <button className="forgoten-password-btn" onClick={() => navigate('/register')}>
            Inget konto? Registrera dig här
          </button>
        </div>

      </div>
    </div>
  );
}