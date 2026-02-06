import type { JSX } from 'react';
import LandingPage from './pages/LandingPage';

interface Route {
  element: JSX.Element;
  path: string;
  menuLabel?: string;
}

const routes: Route[] = [
  { element: <LandingPage />, path: '/', menuLabel: 'Hem' }

  //{ element: <Page-Name />, path: '/file-path', menuLabel: 'Lable-Name' }
];

export default routes;


/*

add to pages to import

import { Link } from 'react-router-dom';
*/