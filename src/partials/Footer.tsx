
/* 
 Option 1: Antingen upptäck, men mest troligast AI chatbot
 Option 2: Login/Your account (Link to my account page)
 Option 3: Menu bar -> Links to "Tema Dagar", "Om oss", "Kontakt", "kiosk" -> 
 -> eventuellt fler/mindre alternativ 
 */


import { useState } from "react";
import { Link } from "react-router-dom";
import type { User } from '../utilities/userInterface';

interface HeaderProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Footer({ user, setUser }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  /* TODO: We should replace this with our actual log in code, this is just a placeholder
  that I put to try it out, ladies and gents ;) */
  //const userIsLoggedIn = false;

  const handleLogout = async () => {
    try {
      await fetch('/api/login', { method: 'DELETE' });
      setUser(null);
    }
    catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <Link to="/" className="footer-btn">
          Upptäck
        </Link>

        {user ? (
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
              {user && (
                <button className="submenu-link" onClick={handleLogout}>Logga ut ({user.firstname})</button>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}