import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [regaccount, setRegAccount] = useState<boolean>(false);


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

    if (formData.firstname.length < 2 || formData.lastname.length < 2) {
      setError("Namn måste vara minst 2 tecken.");
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError("Ange en giltig e-post.");
      return;
    }

    const passwordRegex = /^(?=.*\d).{5,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Lösenordet måste vara minst 5 tecken och innehålla en siffra.");
      return;
    }


    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte!");
      return;
    }

    setError('');

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
        setRegAccount(true);
      } else {
        setError(data.message || "Kunde inte skapa konto.");
      }
    } catch (err) {
      console.error(err);
      setError("Kunde inte ansluta till servern.");
    }
  };

  const closeAndNav = () => {
    setRegAccount(false);
    navigate('/login');
  };

  return (
    <div className="reg-container">
      {regaccount && (
        <div className='popup-window'>
          <div className='popup-content'>
            <h3 className='text-2xl'>Ditt konto är nu skapat</h3>
            <p className='text-xl'>Du kommer nu omdirigeras till inloggningssidan</p>
            <button onClick={closeAndNav}>Stäng</button>
          </div>
        </div>
      )}
      <div className="reg-big-text">
        <h1>Skapa Konto</h1>
      </div>

      <div className="reg-input">
        {error && <p className="error-message">{error}</p>}

        {/*FÖRNAMN*/}
        <div className="reg-name-input">
          <p className='text-xl text-black m-0 font-medium'>Förnamn</p>
          <input
            name="firstname"
            type="text"
            placeholder="Förnamn"
            onChange={handleChange}
          />
        </div>

        {/*EFTERNAMN*/}
        <div className="reg-name-input">
          <p className='text-xl text-black m-0 font-medium'>Efternamn</p>
          <input
            name="lastname"
            type="text"
            placeholder="Efternamn"
            onChange={handleChange}
          />
        </div>

        <div className="reg-email-input">
          <p className='text-xl text-black m-0 font-medium'>E-post</p>
          <input name="email" type="email" placeholder="Din e-post" onChange={handleChange} />
        </div>

        <div className="reg-phone-number-input">
          <p className='text-xl text-black m-0 font-medium'>Telefonnummer</p>
          <input name="phone" type="text" placeholder="070..." onChange={handleChange} />
        </div>

        <div className="reg-Password-input">
          <p className='text-xl text-black m-0 font-medium'>Lösenord</p>
          <input name="password" type="password" placeholder="Välj lösenord" onChange={handleChange} />
        </div>

        <div className="reg-validate-Password-input">
          <p className='text-xl text-black m-0 font-medium'>Bekräfta Lösenord</p>
          <input name="confirmPassword" type="password" placeholder="Upprepa lösenord" onChange={handleChange} />
        </div>

        <div className="reg-confirm">
          <button className="reg-confirm-btn" onClick={handleRegister}>Registrera</button>
        </div>

        <div className="reg-already-account">
          <button className="reg-already-account-btn" onClick={() => navigate('/login')}>
            Har du redan konto? Logga in
          </button>
        </div>
      </div>
    </div>
  );
}