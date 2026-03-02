import type { JSX } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetailsPage';
import AboutUs from './pages/AboutUsPage';
import Contact from './pages/ContactPage';
import Kiosk from './pages/Kiosk';
import Register from './pages/Register';
import Booking from './pages/BookingPage';
import TemaDagar from './pages/TemaDagar';

interface Route {
  element: JSX.Element;
  path: string;
  menuLabel?: string;
}

const routes: Route[] = [
  { element: <LandingPage />, path: '/', menuLabel: 'Hem' },
  { element: <Login />, path: '/Login', menuLabel: 'Login' },
  { element: <AboutUs />, path: '/aboutus', menuLabel: 'Om oss' },
  { element: <Contact />, path: '/contact', menuLabel: 'Kontakt' },
  { element: <MovieDetails />, path: '/moviedetails/:filmid' },
  { element: <Booking />, path: '/booking' },
  { element: <Kiosk />, path: '/Kiosk', menuLabel: 'Kiosk' },
  { element: <Register />, path: '/Register'},
  { element: <TemaDagar />, path: '/themedays', menuLabel: 'Tema Dagar' }

  //{ element: <Page-Name />, path: '/file-path', menuLabel: 'Lable-Name' }
];

export default routes;


/*

add to pages to import

import { Link } from 'react-router-dom';
*/