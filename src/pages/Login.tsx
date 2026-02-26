import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { User } from '../utilities/userInterface';
import '../css/Login.css';

interface LoginContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useOutletContext<LoginContext>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
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
    } catch (err) {
      console.error(err);
      setError("Kunde inte nå servern");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/login', { method: 'DELETE' }); // Säg till backend att döda sessionen
      setUser(null);
    } catch (err) {
      console.error("Kunde inte logga ut", err);
    }
  };

  if (user) {
    return (
      <div className="login-container">
        <div className="login-input">
          <h2>
            Du är redan inloggad
          </h2>
          <p>
            Inloggad som: <strong>{user.firstname ? `${user.firstname} ${user.lastname}` : user.email}</strong>
          </p>

          <button
            className="confirm-btn"
            onClick={handleLogout}
          >
            Logga ut
          </button>

          <button
            className="forgoten-password-btn"
            onClick={() => navigate('/')}
          >
            Gå till startsidan
          </button>
        </div>
      </div>
    );
  }


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