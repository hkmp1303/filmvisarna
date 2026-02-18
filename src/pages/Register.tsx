import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

export default function Register() {
  const navigate = useNavigate();

  // State för alla fält
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  // Hantera ändringar i fälten
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    // 1. Enkel validering
    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte!");
      return;
    }

    // 2. Skicka till backend (anpassa URL om du har en annan route för register)
    // Här antar vi att din backend tar emot en POST på /api/users
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        // Om din databas har kolumner för namn/telefon, skicka med dem:
        // name: formData.name, 
        // phone: formData.phone 
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Om allt gick bra, skicka användaren till inloggningssidan
      navigate('/login');
    } else {
      setError(data.message || "Kunde inte registrera konto");
    }
  };

  return (
    <div className="login-container">
      <div className="login-big-text">
        <h1>Registrera</h1>
      </div>

      <div className="login-input">
        {error && <p className="error-message">{error}</p>}

        <div className="name-input">
          <p>Namn</p>
          <input name="name" type="text" placeholder="Namn" onChange={handleChange} />
        </div>

        <div className="email-input">
          <p>E-post</p>
          <input name="email" type="email" placeholder="E-post" onChange={handleChange} />
        </div>

        <div className="phone-number-input">
          <p>Telefon Nummer</p>
          <input name="phone" type="text" placeholder="Telefon nummer" onChange={handleChange} />
        </div>

        <div className="Password-input">
          <p>Lösenord</p>
          <input name="password" type="password" placeholder="Lösenord" onChange={handleChange} />
        </div>

        <div className="validate-Password-input">
          <p>Bekräfta Lösenord</p>
          <input name="confirmPassword" type="password" placeholder="Upprepa lösenord" onChange={handleChange} />
        </div>

        <div className="confirm">
          <button className="confirm-btn" onClick={handleRegister}>Skapa Konto</button>
        </div>

        <div className="forgotten-password">
          <button className="forgoten-password-btn" onClick={() => navigate('/login')}>
            Har du redan konto? Logga in
          </button>
        </div>

      </div>
    </div>
  );
}