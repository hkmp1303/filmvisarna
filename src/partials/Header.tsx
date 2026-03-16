import { Link, NavLink } from 'react-router-dom';
import routes from '../routes';
import Logo from '../assets/logo-new.svg?react';
import type { User } from '../utilities/userInterface';

interface HeaderProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Header({ user, setUser }: HeaderProps) {


  const handleLogout = async () => {
    try {
      await fetch('/api/login', { method: 'DELETE' });
      setUser(null);
    }
    catch (err) {
      console.error("Logout failed", err);
    }
  };

  return <header>

    <Link to="/" className="header-logo">
      <Logo aria-label="Logotyp av Filmvisarna" />
    </Link>

    <h1 className='text-5xl justify-self-center md:text-4xl xl:text-6xl'>Filmvisarna</h1>

    <nav className='header-nav'>
      {routes
        .filter(route => {
          if (!route.menuLabel) return false;
          if (user && route.path === '/login') return false;
          return true;
        })
        .map((route, i) => (
          <NavLink className="nav-btn" key={i} to={route.path}>{route.menuLabel}</NavLink>
        ))
      }

      {user && (
        <button className="nav-btn" onClick={handleLogout}>Logga ut ({user.firstname})</button>
      )}
    </nav>
  </header>;
}