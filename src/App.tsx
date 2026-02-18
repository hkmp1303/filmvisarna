//import { useState } from 'react'
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Main from './partials/Main';
import Header from './partials/Header';
import Footer from './partials/Footer';
import type { User } from './utilities/types';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/login');
        const data = await response.json();

        if (response.ok && data.email) {
          setUser(data);
        }
      }
      catch (err) {
        console.log("Ingen användare inloggad");
      }
    })();
  }, []);
  const handleLogout = async () => {
    await fetch('/api/login', { method: 'DELETE' });
    setUser(null);
  };



  return (
    <>
      <Header />
      <Main user={user} setUser={setUser} />
      <Footer />
    </>
  );
}




export default App



/*

This is how I did my old routing. 
Add Header and Footer as they are created

import Header from './partials/Header'           - Done
import Main from './partials/Main'               -Done
import Footer from './partials/Footer'
function App() {


  return (
    <>
      <Header />
      <Main />
      <Footer />

    </>
  )
}


export default App

*/
