import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, GraduationCap, Users, Shield } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();



  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    console.log(`Attempting login as ${userType} with email:`, data.email);

    try {
      await login(data.email, data.password, userType);

      console.log(`${userType} login successful, redirecting...`);

      // Role-based redirection
      if (userType === 'student') {
        navigate('/student/dashboard');
      } else if (userType === 'staff') {
        navigate('/staff/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);

      // More specific error messages
      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid email or password.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Account is not active. Please contact administrator.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Government Header */}
      <div className="bg-white shadow-sm border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Department of Technical Education
                </h1>
                <p className="text-sm text-gray-600">Government of Rajasthan</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="h-12 w-12 bg-green-600 rounded"></div>
              <div className="h-12 w-12 bg-white border-2 border-gray-300 rounded"></div>
              <div className="h-12 w-12 bg-orange-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Student Management ERP
            </h2>
            <p className="text-sm text-gray-600">
              Secure Login Portal
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Connected to: sih-one-nu.vercel.app
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border-t-4 border-blue-600">

            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select User Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    userType === 'student'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <GraduationCap className="h-6 w-6 mr-2" />
                  <span className="font-medium">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('staff')}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    userType === 'staff'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <Users className="h-6 w-6 mr-2" />
                  <span className="font-medium">Staff</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    `Sign in as ${userType === 'student' ? 'Student' : 'Staff'}`
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Need help?{' '}
                  <Link to="/contact" className="font-medium text-blue-600 hover:text-blue-500">
                    Contact Administrator
                  </Link>
                </p>
              </div>
            </form>

            {/* Government Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  © 2024 Department of Technical Education, Government of Rajasthan
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All rights reserved | Designed for educational institutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;