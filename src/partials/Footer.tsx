
/* 
 Option 1: Antingen upptäck, men mest troligast AI chatbot
 Option 2: Login/Your account (Link to my account page)
 Option 3: Menu bar -> Links to "Tema Dagar", "Om oss", "Kontakt", "kiosk" -> 
 -> eventuellt fler/mindre alternativ 
 */


import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [menuOpen, setMenuOpen] = useState(false);

  /* TODO: We should replace this with our actual log in code, this is just a placeholder
  that I put to try it out, ladies and gents ;) */
  const userIsLoggedIn = false;

  return (
    <footer className="footer">
      <div className="footer-container">
        <Link to="/" className="footer-btn">
          Upptäck
        </Link>

        {userIsLoggedIn ? (
          <Link to="/account" className="footer-btn">
            Konto
          </Link>
        ) : (
          <Link to="/login" className="footer-btn">
            Logga in
          </Link>
        )}

        <div className="footer-menu-wrapper">
          <button
            className="footer-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Mer
          </button>


          {menuOpen && (
            <div className="footer-submenu">
              <Link className='submenu-link' to="/themedays">Tema dagar</Link>
              <Link className='submenu-link' to="/aboutus">Om oss</Link>
              <Link className='submenu-link' to="/contact">Kontakt</Link>
              <Link className='submenu-link' to="/kiosk">Kiosk</Link>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}