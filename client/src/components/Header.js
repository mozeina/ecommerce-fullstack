import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import '../styles/general.css'
import '../styles/header.css'

function Header() {

    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);

    const [at, setAt] = useState(null);

    const location = useLocation();


    useEffect(() => {
        setVisible1(true);
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setVisible2(true);
        }, 1000)
    }, [visible1])

    useEffect(() => {
        setAt(location.pathname)
    }, [location])
    return (
        <>
            <header className='poiret-one'>
                <h1 className={`fade-in ${visible1 ? 'visible' : ''}`} aria-label="Page Title">Harry's Hair Oils</h1>
                <nav aria-label='Page Navigation'>
                    <ul className={`firstNav fade-in ${visible2 ? 'visible' : ''}`}>
                        <li className={`${at === '/' ? 'atRightNow' : ''}`}><NavLink to='/' aria-label='View our Products'>Products</NavLink></li>
                        <li className={`${at === '/about' ? 'atRightNow' : ''}`}><NavLink to='/about' aria-label='About us'>About</NavLink></li>
                    </ul>
                    <ul className={`secondNav fade-in ${visible2 ? 'visible' : ''}`}>
                        <li className={`${at === '/signup' ? 'atRightNow' : ''}`}><NavLink to='/signup' aria-label='Click here to Sign Up'>Sign up</NavLink></li>
                        <li className={`${at === '/login' ? 'atRightNow' : ''}`}><NavLink to='/login' aria-label='Click here to Log In'>Log in</NavLink></li>
                    </ul>
                </nav>
            </header>
            <main id='main-content'>
                <Outlet />
            </main>
        </>


    )
}

export default Header