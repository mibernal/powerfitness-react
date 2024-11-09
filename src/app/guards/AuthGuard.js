// src/guards/AuthGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const isAuthenticated = true; // Cambia esto por la lógica de autenticación real

  return isAuthenticated ? children : <Navigate to="/login-form" />;
};

export default AuthGuard;
