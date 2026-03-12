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

  const [errors, setErrors] = useState<{ [key: string]: string; }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const newErrors: { [key: string]: string; } = {};

    if (!formData.firstname || formData.firstname.length < 2) {
      newErrors.firstname = "Minst 2 tecken krävs.";
    }

    if (!formData.lastname || formData.lastname.length < 2) {
      newErrors.lastname = "Minst 2 tecken krävs.";
    }

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = "Ange en giltig e-postadress.";
    }

    const passwordRegex = /^(?=.*\d).{5,}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password = "Minst 5 tecken och 1 siffra krävs.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Lösenorden matchar inte.";
    }



    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) { return; }


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

      if (response.ok && data.success) {
        setRegAccount(true);
      } else {
        setErrors({ server: data.message || "Kunde inte skapa konto." });
      }
    } catch (err) {
      console.error(err);
      setErrors({ server: "Kunde inte ansluta till servern." });
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
        {errors.server && <p className="error-message">{errors.server}</p>}

        {/*FÖRNAMN*/}
        <div className="reg-name-input">
          <p className='text-xl text-black m-0 font-medium'>Förnamn</p>
          <input
            name="firstname"
            type="text"
            placeholder="Förnamn"
            onChange={handleChange}
          />
          {errors.firstname && <span className="text-red-500 text-sm m-0 mt-[-10px] font-bold">{errors.firstname}</span>}
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
          {errors.lastname && <span className="text-red-500 text-sm m-0 mt-[-10px] font-bold">{errors.lastname}</span>}
        </div>

        <div className="reg-email-input">
          <p className='text-xl text-black m-0 font-medium'>E-post</p>
          <input name="email" type="email" placeholder="Din e-post" onChange={handleChange} />
          {errors.email && <span className="text-red-500 text-sm m-0 mt-[-10px] font-bold">{errors.email}</span>}
        </div>

        <div className="reg-phone-number-input">
          <p className='text-xl text-black m-0 font-medium'>Telefonnummer</p>
          <input name="phone" type="text" placeholder="070..." onChange={handleChange} />

        </div>

        <div className="reg-Password-input">
          <p className='text-xl text-black m-0 font-medium'>Lösenord</p>
          <input name="password" type="password" placeholder="Välj lösenord" onChange={handleChange} />
          <span className={`text-sm m-0 -mt-2.5 font-bold ${errors.password ? 'text-red-500' : 'text-[#fffdc4]'}`}>
            {errors.password ? errors.password : "Minst 5 tecken och 1 siffra krävs."}
          </span>
        </div>

        <div className="reg-validate-Password-input">
          <p className='text-xl text-black m-0 font-medium'>Bekräfta Lösenord</p>
          <input name="confirmPassword" type="password" placeholder="Upprepa lösenord" onChange={handleChange} />
          {errors.confirmPassword && <span className="text-red-500 text-sm m-0 mt-[-10px] font-bold">{errors.confirmPassword}</span>}
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