//import { useState } from 'react'
import Main from './partials/Main';
import Header from './partials/Header';
import Footer from './partials/Footer';


import './App.css';

function App() {

  return (
    <>
      <Header />
      <Main />
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
