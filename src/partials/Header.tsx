import { Link, NavLink } from 'react-router-dom';
import routes from '../routes';

export default function Header() {

    return <header>

        <Link to="/" className='header-logo'>
            <img src="/public/logav2.svg" alt="Logotyp of Filmvisarna" />
        </Link>

        <h1>Film Visarna</h1>

        <nav className='header-nav'>
            {routes.filter(x => x.menuLabel)
                .map(({ menuLabel, path }, i) =>
                    <NavLink key={i} to={path}>{menuLabel}</NavLink>)}
        </nav>
    </header>
}

/*
Need to add the logo image when

header-nav goes throw every element in routes.tsx and displayes them

*/