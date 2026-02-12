import type { JSX } from 'react';
import LandingPage from './pages/LandingPage';
import Kiosk from './pages/Kiosk';

interface Route {
  element: JSX.Element;
  path: string;
  menuLabel?: string;
}

const routes: Route[] = [
  { element: <LandingPage />, path: '/', menuLabel: 'Hem' },
  { element: <Kiosk />, path: '/Kiosk', menuLabel: 'Kiosk' }

  //{ element: <Page-Name />, path: '/file-path', menuLabel: 'Lable-Name' }
];

export default routes;


/*

add to pages to import

import { Link } from 'react-router-dom';
*/