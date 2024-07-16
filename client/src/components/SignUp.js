import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { ExclamationTriangle, CheckSquare } from 'react-bootstrap-icons';

import '../styles/general.css';
import '../styles/signup.css';


function SignUp() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visibleError, setVisibleError] = useState(false);
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value

    }));
  }

  useEffect(() => {
    setVisible(true);
  }, [])

  const signUp = async (e) => {
    e.preventDefault();
    setError('');
    setVisibleError(false);
    setSuccess(false);
    setVisibleSuccess(false);

    const { username, email, password, confirmPassword } = formValues;

    if (!username) {
      setError('Username cannot be left blank.');
      return;
    }
    if (!email) {
      setError('Email cannot be left blank.');
      return;
    }
    if (!password) {
      setError('Please provide a password.');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Provided passwords do not match.');
      return;
    }

    try {
      const createUser = await axios.post('http://localhost:6543/api/v1/users/register', {
        username,
        email,
        password
      }, { withCredentials: true })
      setSuccess(true);
      // let token = createUser.data.token;
      setTimeout(() => {
        setVisibleSuccess(true)
      }, 200)

    } catch (err) {
      const inputErrors = err.response?.data?.errors ?? "null";
      if (inputErrors && inputErrors.length > 0 && inputErrors[0]['msg']) {
        setError(inputErrors.map(err => {
          return err.msg
        }));
      } else {
        setError(err?.response?.data?.error ?? "Registration Failed.");
      }
    }
  };


  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setVisibleError(true);
      }, 300)
    }
  }, [error])

  useEffect(() => {
    if (visibleSuccess) {
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
  }, [visibleSuccess])

  //debugging 

  return (

    <div className={`sign-up fade-in3 ${visible ? 'visible' : ''}`}>
      <h2 className='sign-up-header'>Sign Up</h2>

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
          <p>Signed Up Successfully</p>
        </div>
      )}

      <form id='sign-up' onSubmit={signUp}>
        <div className='username'>
          <label htmlFor='username'>Username: </label><br />
          <input id='username' name='username' type='text' className='username-input' onChange={handleChange} />
        </div>

        <div className='email'>
          <label htmlFor='email'>Email: </label><br />
          <input id='email' name='email' type='text' className='email-input' onChange={handleChange} />
        </div>


        <div className='password'>
          <label htmlFor="password">Password: </label><br />
          <input type='password' name='password' id='password' className='password-input' onChange={handleChange} />
        </div>

        <div className='password'>
          <label htmlFor="confirm-password">Confirm Password: </label><br />
          <input type='password' name='confirmPassword' id='confirm-password' className='password-input' onChange={handleChange} />
        </div>

        <button id='submit' type='submit' data-testid='submit-button'>Submit</button>

      </form>

      <NavLink to="../login">
        <p className='navigate-to-signup-login' style={{ marginTop: 30, color: "black", paddingLeft: 10, paddingRight: 10 }}>Already have an account? click here to log in.</p>
      </NavLink>
    </div>
  )
}

export default SignUp
