import { Link, NavLink } from 'react-router-dom';
import routes from '../routes';
import Logo from '../assets/logo-new.svg?react';

export default function Header() {

  return <header>



    <Link to="/" className="header-logo">
      <Logo aria-label="Logotyp av Filmvisarna" />
    </Link>


    <h1 className='text-5xl justify-self-center md:text-4xl xl:text-6xl'>Filmvisarna</h1>

    <nav className='header-nav'>
      {routes.filter(x => x.menuLabel)
        .map(({ menuLabel, path }, i) =>
          <NavLink key={i} to={path}>{menuLabel}</NavLink>)}
    </nav>
  </header>;
}