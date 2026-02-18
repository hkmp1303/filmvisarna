import type { JSX } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetailsPage';
import AboutUs from './pages/AboutUsPage';
import Register from './pages/register';

interface Route {
  element: JSX.Element;
  path: string;
  menuLabel?: string;
}

const routes: Route[] = [
  { element: <LandingPage />, path: '/', menuLabel: 'Hem' },
  { element: <AboutUs />, path: '/aboutus', menuLabel: 'aboout us' },
  { element: <Login />, path: '/Login' },
  { element: <MovieDetails />, path: '/moviedetails/:filmid' },
  { element: <Register />, path: '/register' }

  //{ element: <Page-Name />, path: '/file-path', menuLabel: 'Lable-Name' }
];

export default routes;


/*

add to pages to import

import { Link } from 'react-router-dom';
*/