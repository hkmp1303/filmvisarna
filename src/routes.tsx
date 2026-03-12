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
import ConfirmBooking from './pages/ConfirmBooking';
import PasswordRecovery from './pages/PasswordRecoveryPage';
import ResetPassword from './pages/ResetPasswordPage';

interface Route {
  element: JSX.Element;
  path: string;
  menuLabel?: string;
}

const routes: Route[] = [
  { element: <LandingPage />, path: '/', menuLabel: 'Hem' },
  { element: <Login />, path: '/login', menuLabel: 'Login' },
  { element: <AboutUs />, path: '/aboutus', menuLabel: 'Om oss' },
  { element: <Contact />, path: '/contact', menuLabel: 'Kontakt' },
  { element: <MovieDetails />, path: '/moviedetails/:filmid' },
  { element: <Booking />, path: '/booking' },
  { element: <Kiosk />, path: '/Kiosk', menuLabel: 'Kiosk' },
  { element: <Register />, path: '/register' },
  { element: <TemaDagar />, path: '/themedays', menuLabel: 'Temadagar' },
  { element: <ConfirmBooking />, path: '/confirmbooking' },
  { element: <PasswordRecovery />, path: '/passwordrecovery' },
  { element: <ResetPassword />, path: '/reset-password' }


  //{ element: <Page-Name />, path: '/file-path', menuLabel: 'Lable-Name' }
];

export default routes;


/*

add to pages to import

import { Link } from 'react-router-dom';
*/