import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../src/components/login/Loginpage';
import Profile from '../src/components/profile/Profile';
import RegistrationPage from '../src/components/resitration/Registed'; 
import SignUpPage from '../src/components/resitration/Registed';
import Prep from './components/try/try';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/prep" element={<Prep />} />
        
      </Routes>
    </Router>
  );
}

export default App;
