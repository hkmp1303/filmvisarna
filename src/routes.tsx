import type { JSX } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetailsPage';
import AboutUs from './pages/AboutUsPage';
import Contact from './pages/ContactPage';

interface Route {
  element: JSX.Element;
  path: string;
  menuLabel?: string;
}

const routes: Route[] = [
  { element: <LandingPage />, path: '/', menuLabel: 'Hem' },
  { element: <Login />, path: '/Login', menuLabel: 'login' },
  { element: <AboutUs />, path: '/aboutus', menuLabel: 'about us' },
  { element: <Contact />, path: '/contact', menuLabel: 'Kontakt' },
  { element: <MovieDetails />, path: '/moviedetails/:filmid' }

  //{ element: <Page-Name />, path: '/file-path', menuLabel: 'Lable-Name' }
];

export default routes;


/*

add to pages to import

import { Link } from 'react-router-dom';
*/