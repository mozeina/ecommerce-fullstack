import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Header from "./components/Header.js";
import About from './components/About';
import Products from './components/Products'
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Products />} />
          <Route path="about" element={<About />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='login' element={<LogIn />}/>
        </Route>
      </Routes> 
    </BrowserRouter>
  ) 
}

export default App
