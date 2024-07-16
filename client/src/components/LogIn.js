import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { ExclamationTriangle, CheckSquare } from 'react-bootstrap-icons';
import { HeaderContext } from '../App';

import '../styles/general.css';
import '../styles/signup.css';


function LogIn() {
  const { setHeaderUpdate } = useContext(HeaderContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visibleError, setVisibleError] = useState(false);
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value

    }));
  }

  useEffect(() => {
    setVisible(true);
    setHeaderUpdate(prev => !prev);
  }, [])

  const logIn = async (e) => {
    e.preventDefault();
    setError('');
    setVisibleError(false);
    setSuccess(false);
    setVisibleSuccess(false);

    const { email, password } = formValues;


    if (!email) {
      setError('Email cannot be left blank.');
      return;
    }
    if (!password) {
      setError('Please provide a password.');
      return;
    }


    try {
      const retrieveUser = await axios.post('http://localhost:6543/api/v1/users/login', {
        email,
        password
      }, { withCredentials: true })
      setSuccess(true);

      setTimeout(() => {
        setVisibleSuccess(true);
      }, 200)

    } catch (err) {
      const inputErrors = err.response?.data?.errors ?? "null";
      if (inputErrors && inputErrors.length > 0 && inputErrors[0]['msg']) {
        setError(err.response.data.errors.map(err => {
          return err.msg
        }));
      } else {
        setError(err.response?.data?.error ?? "Log In Failed.");
      }
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setVisibleError(true);
      }, 200)
    }
  }, [error])

  useEffect(() => {
    if (visibleSuccess) {
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
  }, [visibleSuccess])


  return (

    <div className={`sign-up fade-in3 ${visible ? 'visible' : ''}`}>
      <h2 className='sign-up-header'>Log In</h2>

      {!success && error && Array.isArray(error) && error.length > 0 && (
        <div className={`sign-up-input-errors fade-in3 ${visibleError ? 'visible' : ''} `}>
          <ExclamationTriangle id='sign-up-error-triangle' />
          {error.map((err, index) => {
            return (
              <p key={index} className='sign-up-errors-text'>{err}</p>
            )
          })}
        </div>
      )}

      {!success && error && !Array.isArray(error) && (
        <div className={`sign-up-input-errors fade-in3 ${visibleError ? 'visible' : ''} `}>
          <ExclamationTriangle id='sign-up-error-triangle' />
          <p className='sign-up-errors-text'>{error}</p>
        </div>
      )}

      {success && (
        <div className={`sign-up-success fade-in3 ${visibleSuccess ? 'visible' : ''}`}>
          <CheckSquare className='check-square' />
          <p>Log In Successful</p>
        </div>
      )}

      <form id='sign-up' onSubmit={logIn}>

        <div className='email'>
          <label htmlFor='email'>Email: </label><br />
          <input id='email' name='email' type='text' className='email-input' onChange={handleChange} />
        </div>


        <div className='password'>
          <label htmlFor="password">Password: </label><br />
          <input type='password' name='password' id='password' className='password-input' onChange={handleChange} />
        </div>

        <button id='submit' data-testid="log-in-button" type='submit'>Log In</button>

      </form>
      <NavLink to="../signup">
        <p className='navigate-to-sign-up' style={{ marginTop: 30, color: "black", paddingLeft: 10, paddingRight: 10 }}>Don't have an account? click here to sign up.  </p>
      </NavLink>
    </div>
  )
}

export default LogIn;
