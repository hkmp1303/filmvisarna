
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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
          <Link to="/profile" className="footer-btn">
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
              <button className="submenu-link" onClick={() => { scrollToTop(); setMenuOpen(false); }}>
                Till toppen
              </button>
              <Link className='submenu-link' onClick={() => setMenuOpen(false)} to="/themedays">Tema dagar</Link>
              <Link className='submenu-link' onClick={() => setMenuOpen(false)} to="/aboutus">Om oss</Link>
              <Link className='submenu-link' onClick={() => setMenuOpen(false)} to="/contact">Kontakt</Link>
              <Link className='submenu-link' onClick={() => setMenuOpen(false)} to="/kiosk">Kiosk</Link>
              {user && (
                <button className="submenu-link" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logga ut ({user.firstname})</button>
              )}
            </div>
          )}
        </div>
      </div>
      {/*PC view*/}
      <div className="footer-container-pc">
        <div className="company-cr">
          <h4>© 2026 Filmvisarna AB.</h4>
          <p>All rights reserved</p>
        </div>

        <div className="footer-open-hours">
          <h3 className='text-xl font-semibold text-center mb-0.5'>Öppettider:</h3>
          <p className='text-l mb-0.5'>Måndag - Fredag: 13:00 - 23:00</p>
          <p className='text-l'>Lördag - Söndag: 10:00 - 00:00</p>

        </div>

        <nav className="pc-nav">
          <button className="back-to-top" onClick={scrollToTop}>
            Till toppen
          </button>
          <Link to="/themedays">Temadagar</Link>
          <Link to="/aboutus">Om oss</Link>
          <Link to="/contact">Kontakt</Link>
        </nav>
      </div>
    </footer>


  );
}
//<Link to="/kiosk">Kiosk</Link>