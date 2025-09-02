import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API Configuration
const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try student protected route first
      const studentResponse = await api.get('/student/protected');
      setUser({ userType: 'student' });
      setIsAuthenticated(true);
    } catch (studentError) {
      try {
        // Try staff protected route
        const staffResponse = await api.get('/staff/protected');
        setUser({ userType: 'staff' });
        setIsAuthenticated(true);
      } catch (staffError) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, userType) => {
    try {
      setLoading(true);
      console.log(`Attempting ${userType} login for:`, email);

      let response;
      if (userType === 'student') {
        response = await api.post('/student/login', { email, password });
        setUser({
          ...response.data.student,
          userType: 'student'
        });
      } else if (userType === 'staff') {
        response = await api.post('/staff/login', { email, password });
        setUser({
          ...response.data.staff,
          userType: 'staff',
          role: response.data.staff.role // Important: Get role from backend
        });
      }

      setIsAuthenticated(true);
      console.log('Login successful, user data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user?.userType === 'student') {
        await api.post('/student/logout');
      } else if (user?.userType === 'staff') {
        await api.post('/staff/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
