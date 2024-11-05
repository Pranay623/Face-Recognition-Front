import React, { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import logo from './assets/logo.jpg'; // Ensure this path is correct for your logo image
import  uncle from './assets/loginin.png'


const LoginPage = () => {
  const [email, setEmail] = useState('');   
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    console.log('Submitting:', { email, password }); // Log the email and password

    try {
      const response = await fetch('https://face-recognition-backend-gamma.vercel.app/user/signin', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        console.log("Sign in successful!");
        localStorage.setItem('userID', data.data._id); // Storing user ID
        localStorage.setItem('userName', data.data.name); 
        navigate('/prep');
      } else {
        setError(data.message || "Sign in failed.");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setError("An error occurred during sign in.");
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        {/* Left Side with Illustration */}
        <div className="camara-pos">
          <div className="camara-box">
            <img src={uncle} alt="Illustration" className="logo-image" />
          
          </div>
        </div>

        {/* Right Side with Login Form */}
        <div className="login-page">
          <h2>Log In</h2>
          {error && <p className="error">{error}</p>}
          <p>
            Don't have an account? 
            <Link to="/register" className="create-account"> Create an account</Link>
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="form-group">
              <input
                type="email"
                value={email}
                placeholder='Full Name'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaUser className='icons' />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className='icons' />
            </div>

            {/* Submit Button */}
            <div className='loginbtn'>
              <button type="submit">Log in</button>
            </div>

            
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;