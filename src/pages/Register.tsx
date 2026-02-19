import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css';

export default function Register() {
  const navigate = useNavigate();

  // firstname och lastname separat
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    // Validera att båda namnen är ifyllda
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      setError("Fyll i förnamn, efternamn, e-post och lösenord.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte!");
      return;
    }

    try {
      // Skicka datan direkt
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Konto skapat! Du kan nu logga in.");
        navigate('/login');
      } else {
        setError(data.message || "Kunde inte skapa konto.");
      }
    } catch (err) {
      console.error(err);
      setError("Kunde inte ansluta till servern.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-big-text">
        <h1>Skapa Konto</h1>
      </div>

      <div className="login-input">
        {error && <p className="error-message">{error}</p>}

        {/*FÖRNAMN*/}
        <div className="name-input">
          <p>Förnamn</p>
          <input
            name="firstname"
            type="text"
            placeholder="Förnamn"
            onChange={handleChange}
          />
        </div>

        {/*EFTERNAMN*/}
        <div className="name-input">
          <p>Efternamn</p>
          <input
            name="lastname"
            type="text"
            placeholder="Efternamn"
            onChange={handleChange}
          />
        </div>

        <div className="email-input">
          <p>E-post</p>
          <input name="email" type="email" placeholder="Din e-post" onChange={handleChange} />
        </div>

        <div className="phone-number-input">
          <p>Telefonnummer</p>
          <input name="phone" type="text" placeholder="070..." onChange={handleChange} />
        </div>

        <div className="Password-input">
          <p>Lösenord</p>
          <input name="password" type="password" placeholder="Välj lösenord" onChange={handleChange} />
        </div>

        <div className="validate-Password-input">
          <p>Bekräfta Lösenord</p>
          <input name="confirmPassword" type="password" placeholder="Upprepa lösenord" onChange={handleChange} />
        </div>

        <div className="confirm">
          <button className="confirm-btn" onClick={handleRegister}>Registrera</button>
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