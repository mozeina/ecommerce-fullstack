import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangle, CheckSquare } from 'react-bootstrap-icons';

import '../styles/general.css';
import '../styles/signup.css';


function SignUp() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visibleError, setVisibileError] = useState(false);
  const [visibleSuccess, setVisibileSuccess] = useState(false);
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
    setVisibileError(false);
    setSuccess(false);
    setVisibileSuccess(false);

    const { username, email, password, confirmPassword } = formValues;

    if (!username) {
      setError('Username cannot be left blank.');
      setVisibileError(true);
      return;
    }
    if (!email) {
      setError('Email cannot be left blank.');
      setVisibileError(true);
      return;
    }
    if (!password) {
      setError('Please provide a password.');
      setVisibileError(true);
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password.');
      setVisibileError(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Provided passwords do not match.');
      setVisibileError(true);
      return;
    }

    try {
      const createUser = await axios.post('http://localhost:6543/api/v1/users/register', {
        username,
        email,
        password
      })
      setSuccess(true);
      let token = createUser.data.token;
      setTimeout(() => {
        setVisibileSuccess(true)
      }, 200)

    } catch (err) {
      const inputErrors = err.response.data.errors;
      if (inputErrors && inputErrors.length > 0 && inputErrors[0]['msg']) {
        setError(err.response.data.errors.map(err => {
          return err.msg
        }));
      } else {  
        setError(err.response.data.error);
      }
      setTimeout(() => {
        setVisibileError(true);
      }, 200)
    }
  };

  useEffect(() => {
    if (error) {
      console.log(error);
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

        <button id='submit' type='submit'>Submit</button>

      </form>
    </div>
  )
}

export default SignUp
