import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  
  if (!user) {
    // Redirect to auth page if user is not logged in
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

export default ProtectedRoute;