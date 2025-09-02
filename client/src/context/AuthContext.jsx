import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is already authenticated by making a request to protected route
      const response = await authAPI.checkAuth();
      if (response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // User is not authenticated
      setUser(null);
      setIsAuthenticated(false);
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
        response = await authAPI.loginStudent(email, password);
        console.log('Student login response:', response.data);
        setUser({
          ...response.data.student,
          userType: 'student'
        });
      } else if (userType === 'staff') {
        response = await authAPI.loginStaff(email, password);
        console.log('Staff login response:', response.data);
        setUser({
          ...response.data.staff,
          userType: 'staff'
        });
      } else {
        throw new Error('Invalid user type selected');
      }

      setIsAuthenticated(true);
      console.log('Login successful, user set:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
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
        await authAPI.logoutStudent();
      } else if (user?.userType === 'staff') {
        await authAPI.logoutStaff();
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
