import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaVoicemail } from 'react-icons/fa';
import './Registed.css';
import man from './assets/signup.png';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('https://face-recognition-backend-gamma.vercel.app/signup', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      navigate('/login'); // Redirect on successful sign-up
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="image-section">
          <img src={man} alt="Profile" className="profile-image" />
        </div>
        <div className="form-section">
          <h2>Sign Up</h2>
          <p>Already have an account? <a href="/login">Log In</a></p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                value={name}
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
              <span className="icon">  👤</span>
            </div>
            <div className="input-group">
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="icon">📧</span>
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="icon">🔒</span>
            </div>
            <label htmlFor="profile-pic" className="file-upload">Upload a Profile picture</label>
            <input
              type="file"
              id="profile-pic"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;