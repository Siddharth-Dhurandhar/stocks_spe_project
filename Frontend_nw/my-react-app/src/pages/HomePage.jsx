import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const HomePage = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      <p>This is the page you'll define later.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;