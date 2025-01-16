// AuthContext.js

'use client';  // Add this line at the top to mark this file as a client-side component

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  isAuthenticated: false,
  user: null,
};

const AuthContext = createContext(null);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(storedAuthState) });
    }
  }, []);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('authState', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('authState');
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
