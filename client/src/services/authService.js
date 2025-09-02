import axios from 'axios';
import { getBaseURL, API_CONFIG } from '../config/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Student authentication
  loginStudent: async (email, password) => {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.STUDENT.LOGIN;
      console.log('Calling student login API:', `${getBaseURL()}${endpoint}`);
      const response = await api.post(endpoint, { email, password });
      console.log('Student login API response:', response.status, response.data);
      return response;
    } catch (error) {
      console.error('Student login API error:', error.response?.data || error.message);
      throw error;
    }
  },

  logoutStudent: async () => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.STUDENT.LOGOUT);
      return response;
    } catch (error) {
      console.error('Student logout error:', error.response?.data || error.message);
      throw error;
    }
  },

  registerStudent: async (studentData) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.STUDENT.REGISTER, studentData);
      return response;
    } catch (error) {
      console.error('Student registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Staff authentication
  loginStaff: async (email, password) => {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.STAFF.LOGIN;
      console.log('Calling staff login API:', `${getBaseURL()}${endpoint}`);
      const response = await api.post(endpoint, { email, password });
      console.log('Staff login API response:', response.status, response.data);
      return response;
    } catch (error) {
      console.error('Staff login API error:', error.response?.data || error.message);
      throw error;
    }
  },

  logoutStaff: async () => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.STAFF.LOGOUT);
      return response;
    } catch (error) {
      console.error('Staff logout error:', error.response?.data || error.message);
      throw error;
    }
  },

  registerStaff: async (staffData) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.STAFF.REGISTER, staffData);
      return response;
    } catch (error) {
      console.error('Staff registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      console.log('Checking authentication status...');
      // Try student protected route first
      const studentResponse = await api.get(API_CONFIG.ENDPOINTS.STUDENT.PROTECTED);
      console.log('Student auth check successful');
      return { data: { user: { userType: 'student' } } };
    } catch (studentError) {
      console.log('Student auth check failed, trying staff...');
      try {
        // Try staff protected route
        const staffResponse = await api.get(API_CONFIG.ENDPOINTS.STAFF.PROTECTED);
        console.log('Staff auth check successful');
        return { data: { user: { userType: 'staff' } } };
      } catch (staffError) {
        console.log('Both auth checks failed - user not authenticated');
        throw new Error('Not authenticated');
      }
    }
  }
};

export default api;
