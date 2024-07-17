import React, { useEffect, useState, useContext } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cart4 } from "react-bootstrap-icons";
import { HeaderContext } from "../App";
import ConfirmationModal from "./ConfirmationModal";

import '../styles/general.css'
import '../styles/header.css'

function Header() {
    const navigate = useNavigate();
    const { headerUpdate } = useContext(HeaderContext);

    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);


    const [at, setAt] = useState(null);

    const location = useLocation();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggedOut, setLoggedOut] = useState(false);
    const [loggedOutMessage, setLoggedOutMessage] = useState('');
    const [logoutError, setLogoutError] = useState(false);

    const checkAuthenticated = async () => {
        try {
            const auth = await axios.get("https://hhobackend.onrender.com/api/v1/checkAuth", { withCredentials: true });
            setIsAuthenticated(true)
        } catch (err) {
            setIsAuthenticated(false);
        }
    }


    const logout = async () => {
        setLoggedOut(false);
        setLogoutError(false);
        setLoggedOutMessage("")
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            await axios.get("https://hhobackend.onrender.com/api/v1/users/logout", { withCredentials: true });
            setLoggedOut(true)
            setLoggedOutMessage("Logged out successfully.");
            setTimeout(() => {
                checkAuthenticated();
                navigate("/");
                setShowLogoutModal(false);
            }, 2000);

        } catch (err) {
            setLoggedOut(false);
            setLogoutError(true);
            setTimeout(() => {
                navigate("/");
                setShowLogoutModal(false);
            }, 2000);
        }
    }

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    }

    useEffect(() => {
        checkAuthenticated();
    }, [headerUpdate])

    useEffect(() => {
        setVisible1(true);
        checkAuthenticated();
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
                        {!isAuthenticated && (
                            <>
                                <li className={`${at === '/signup' ? 'atRightNow' : ''}`}><NavLink to='/signup' aria-label='Click here to Sign Up'>Sign up</NavLink></li>
                                <li className={`${at === '/login' ? 'atRightNow' : ''}`}><NavLink to='/login' aria-label='Click here to Log In'>Log in</NavLink></li>
                            </>
                        )}

                        {isAuthenticated && (
                            <>
                                <NavLink to="/cart" style={{ fontSize: '1.5rem' }}><Cart4 /></NavLink>
                                <p id="logout" onClick={logout}>Log Out</p>

                            </>

                        )}
                    </ul>
                </nav>
            </header>
            <main id='main-content'>
                <Outlet />
                <ConfirmationModal
                    show={showLogoutModal}
                    message={"Are you sure you want to log out?"}
                    onConfirm={handleLogoutConfirm}
                    onCancel={handleLogoutCancel}
                    loggedOut={loggedOut}
                    loggedOutMessage={loggedOutMessage}
                    logoutError={logoutError}
                />
            </main>
        </>


    )
}

export default Header