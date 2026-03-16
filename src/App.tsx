import { useState, useEffect } from 'react';
import Main from './partials/Main';
import Header from './partials/Header';
import Footer from './partials/Footer';
import AiChat from './utilities/AiChat';
import type { User } from './utilities/userInterface';
import './App.css';
import { ThemedayToggle } from './utilities/ThemedayToggle';

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      ThemedayToggle(savedTheme);
    }
  }, []);




  return (
    <>
      <Header user={user} setUser={setUser} />
      <AiChat />
      <Main user={user} setUser={setUser} />
      <Footer user={user} setUser={setUser} />
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
