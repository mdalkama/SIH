// API Configuration
export const API_CONFIG = {
  // Production API URL
  BASE_URL: 'https://sih-one-nu.vercel.app/api/v1',
  
  // Development fallback (if needed)
  DEV_BASE_URL: 'http://localhost:5000/api/v1',
  
  // Endpoints
  ENDPOINTS: {
    STUDENT: {
      LOGIN: '/student/login',
      LOGOUT: '/student/logout',
      REGISTER: '/student/admitstudent',
      PROTECTED: '/student/protected'
    },
    STAFF: {
      LOGIN: '/staff/login',
      LOGOUT: '/staff/logout',
      REGISTER: '/staff/register',
      PROTECTED: '/staff/protected'
    }
  },
  
  // Request configuration
  TIMEOUT: 10000, // 10 seconds
  WITH_CREDENTIALS: true
};

// Helper function to get the correct base URL
export const getBaseURL = () => {
  // Always use production URL for deployed version
  return API_CONFIG.BASE_URL;
};

// Helper function to get full endpoint URL
export const getEndpointURL = (userType, action) => {
  const baseURL = getBaseURL();
  const endpoint = API_CONFIG.ENDPOINTS[userType.toUpperCase()][action.toUpperCase()];
  return `${baseURL}${endpoint}`;
};

export default API_CONFIG;
