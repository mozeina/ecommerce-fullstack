import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { createContext, useState } from "react";

import Header from "./components/Header.js";
import About from './components/About';
import Products from './components/Products'
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Cart from "./components/Cart.js";

export const HeaderContext = createContext();

function App() {
  const [headerUpdate, setHeaderUpdate] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  return (
    <HeaderContext.Provider value={{headerUpdate, setHeaderUpdate, loggedOut, setLoggedOut}}>  
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Products />} />
            <Route path="about" element={<About />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='login' element={<LogIn />} />
            <Route path='cart' element={<Cart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HeaderContext.Provider>
  )
}

export default App;

