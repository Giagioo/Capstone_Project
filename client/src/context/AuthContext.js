// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importa il named export

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    // Recupera il token dal localStorage se esiste
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token on load:', decoded); // Log per debug
        setAuthData({
          token,
          user: decoded.user,
        });
      } catch (err) {
        console.error('Token non valido', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    console.log('Token ricevuto durante il login:', token); // Log per debug
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    console.log('Decoded token durante il login:', decoded); // Log per debug
    setAuthData({
      token,
      user: decoded.user,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthData({
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
