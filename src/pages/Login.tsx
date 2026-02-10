const LoginGallery: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-big-text">
        <h1>Login</h1>
      </div>
      <div className="login-input">
        <div className="email-input">
          <input type="txet" placeholder="gmail"></input>
        </div>
        <div className="Password-input">
          <input type="txet" placeholder="lösenord"></input>
        </div>
        <div className="forgotten-password">
          <button className="forgoten-password-btn">glömt lösenord</button>
        </div>
        <div className="confirm- button"></div>

      </div>
    </div>

  );
};

export default LoginGallery;