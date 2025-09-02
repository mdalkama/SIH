import React, { useState } from 'react';
import { User, Users, Eye, EyeOff, ArrowRight, LogOut, CheckCircle, AlertCircle, Mail, Lock } from 'lucide-react';

const LoginSystem = () => {
  const [userType, setUserType] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [jwtToken, setJwtToken] = useState('');

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setCredentials({ email: '', password: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleLogin = async () => {
    if (!userType || !credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!credentials.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    const loginUrl = userType === 'student'
      ? 'http://localhost:8000/api/v1/student/login'
      : 'http://localhost:8000/api/v1/staff/login';

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', {
          status: response.status,
          statusText: response.statusText,
          contentType: contentType,
          url: loginUrl
        });

        // Try to get response text for debugging
        const responseText = await response.text();
        console.error('Response body:', responseText.substring(0, 200) + '...');

        setError(`API Error: Expected JSON response but got ${contentType || 'unknown content type'}. The API endpoint might be incorrect.`);
        return;
      }

      const data = await response.json();
      console.log('API Response:', { status: response.status, data });

      if (response.ok) {
        // Successful login
        if (data.user || data.data || (data.email || data.name || data.id)) {
          setIsLoggedIn(true);
          setUserData(data.user || data.data || data); // Handle different response structures
          setJwtToken(data.token || data.accessToken || data.jwt || data.authToken || 'demo-jwt-token-' + Date.now());
          setCredentials({ email: '', password: '' });
        } else {
          setError('Login successful but no user data received from server.');
        }
      } else {
        // Login failed
        setError(data.message || data.error || data.msg || `Login failed with status ${response.status}. Please check your credentials.`);
      }
    } catch (err) {
      console.error('Login error:', err);

      if (err.name === 'SyntaxError' && err.message.includes('Unexpected token')) {
        setError('API Error: Server returned invalid JSON. The API endpoint might be returning HTML instead of JSON data. Please check the API URLs.');
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network Error: Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError(`Error: ${err.message}. Please try again or contact support.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setJwtToken('');
    setUserType('');
    setCredentials({ email: '', password: '' });
    setError('');
  };

  const handleBack = () => {
    setUserType('');
    setCredentials({ email: '', password: '' });
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // If user is logged in, show user data and logout
  if (isLoggedIn && userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Login Successful!</h1>
            <p className="text-gray-600 text-sm">Welcome to ERP Portal</p>
          </div>

          {/* User Data Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-6">
            {/* Header */}
            <div className={`p-4 ${userType === 'student' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {userType === 'student' ? (
                    <User className="w-5 h-5 mr-2" />
                  ) : (
                    <Users className="w-5 h-5 mr-2" />
                  )}
                  <span className="font-semibold capitalize">{userType} Dashboard</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all text-sm"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>

            {/* User Information */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(userData).map(([key, value]) => {
                  if (key === 'password' || key === 'token') return null; // Skip sensitive data
                  return (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-gray-800 mt-1">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* JWT Token Display */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-100 border-b">
              <h3 className="text-lg font-semibold text-gray-800">JWT Token</h3>
              <p className="text-sm text-gray-600">Authentication token for API requests</p>
            </div>
            <div className="p-4">
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm break-all">
                {jwtToken}
              </div>
              <div className="mt-3 text-xs text-gray-600">
                <strong>Note:</strong> This token can be used for authenticated API requests. Store it securely and include it in the Authorization header as "Bearer {jwtToken}".
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>Government of India | Educational Management System</p>
            <p className="mt-1">Secure Portal v2.0</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ERP Login Portal</h1>
          <p className="text-gray-600 text-sm">Government Educational Management System</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {!userType ? (
            /* User Type Selection */
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Select User Type
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => handleUserTypeSelect('student')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">Student Login</div>
                      <div className="text-sm text-gray-600">Access student portal and services</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-500" />
                  </div>
                </button>

                <button
                  onClick={() => handleUserTypeSelect('staff')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">Staff Login</div>
                      <div className="text-sm text-gray-600">Access staff portal and administration</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-500" />
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <div>
              {/* Header with user type */}
              <div className={`p-4 ${userType === 'student' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {userType === 'student' ? (
                      <User className="w-5 h-5 mr-2" />
                    ) : (
                      <Users className="w-5 h-5 mr-2" />
                    )}
                    <span className="font-semibold capitalize">{userType} Login</span>
                  </div>
                  <button
                    onClick={handleBack}
                    className="text-white hover:text-gray-200 text-sm underline"
                  >
                    Change User Type
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <div className="p-8">
                {/* API Status Info */}
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>API Endpoint:</strong> {userType === 'student' ? 'https://sih-one-nu.vercel.app/v1/student/login' : 'https://sih-one-nu.vercel.app/v1/staff/login'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    If you get JSON errors, the API endpoint might not be configured properly or is returning HTML instead of JSON.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={`Enter your ${userType} email`}
                      />
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your password"
                      />
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${userType === 'student'
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>

                {/* Additional Links */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center space-y-2">
                    <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                      Forgot Password?
                    </a>
                    <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                      Need Help?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Government of India | Educational Management System</p>
          <p className="mt-1">Secure Login Portal v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSystem;