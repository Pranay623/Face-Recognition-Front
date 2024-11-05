import React, { useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import animation1 from './assets/animation1.jpg';

const Profile = () => {
  const navigate = useNavigate(); // Use useNavigate hook to navigate programmatically
  const [email, setEmail] = useState(''); // State for email (if needed)
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile details:', { email });
    
    // Navigate to a different route or perform another action on submission
    navigate('/'); // Redirect to home or any other route
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className='camara-pos'>
          <div className="camara-box">
           <div className='header'>
           <h1>Dashboard</h1>
           <p>Welcome , <span>[User name]</span></p>
           </div>
            <button>Mark Attendance</button>
               <div>
                <h1>Current Attendance</h1>
                <p>Aman - Present</p>
                <hr/>
                <p>Pranay - Present</p>
                <hr/>
                <p>Abhisekh - Present</p>
                <hr/>
                <p>Nikhil - Present</p>
                <hr/>
               </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attandance;
