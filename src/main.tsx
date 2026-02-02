import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import type { RouteObject } from 'react-router'
import { createBrowserRouter, RouterProvider, } from 'react-router'
import routes from './routes.tsx'


import './index.css'
import App from './App.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes as RouteObject[]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
