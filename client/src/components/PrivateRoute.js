import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element }) => {
  const isLoggedIn = !!localStorage.getItem('token');
  return isLoggedIn ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;
