import '../css/Login.css';

const LoginGallery: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-big-text">
        <h1>Login</h1>
      </div>
      <div className="login-input">
        <div className="name-input">
          <p>Namn</p>
          <input type="text" placeholder="Namn"></input>
        </div>
        <div className="email-input">
          <p>E-post</p>
          <input type="text" placeholder="E-post"></input>
        </div>
        <div className="phone-number-input">
          <p>Telefon Nummer</p>
          <input type="text" placeholder="Telefon nummer"></input>
        </div>
        <div className="Password-input">
          <p>Lösenord</p>
          <input type="text" placeholder="Lösenord"></input>
        </div>
        <div className="validate-Password-input">
          <p>bekräfta Lösenord </p>
          <input type="text" placeholder="Lösenord bekräftning"></input>
        </div>
        <div className="forgotten-password">
          <button className="forgoten-password-btn">glömt lösenord</button>
        </div>
        <div className="confirm">
          <button className="confirm-btn">Confirm</button>
        </div>

      </div>
    </div>

  );
};

export default LoginGallery;