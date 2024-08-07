import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { auth } = useAuth();
  
  return auth ? element : <Navigate to="/" />;
};

export default ProtectedRoute;