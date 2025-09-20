import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Mail,
  ArrowLeft,
  Lock,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const StatusOtpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicationId: localStorage.getItem('applicationId') || '',
    email: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('counsellingSession');
      if (sessionData) {
        try {
          const { applicationId, expiresAt } = JSON.parse(sessionData);
          // Redirect to counselling if session is still valid
          if (expiresAt > Date.now()) {
            navigate(`/counselling/overview?applicationId=${applicationId}`);
            return true;
          } else {
            // Clear expired session
            localStorage.removeItem('counsellingSession');
            localStorage.removeItem('applicationId');
          }
        } catch (error) {
          console.error('Error parsing session data:', error);
          // Clear invalid session data
          localStorage.removeItem('counsellingSession');
          localStorage.removeItem('applicationId');
        }
      }
      return false;
    };

    checkSession();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.applicationId) {
      newErrors.applicationId = 'Application ID is required';
    } else if (!/^APP\d{10,}$/.test(formData.applicationId)) {
      newErrors.applicationId = 'Please enter a valid Application ID (format: APP followed by numbers)';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp !== '1235') {
      newErrors.otp = 'Invalid OTP. Please check the OTP sent to your email.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOtpSent(true);
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set session data for protected route
      const sessionData = {
        otpVerified: true,
        applicationId: formData.applicationId,
        email: formData.email,
        timestamp: Date.now(),
        // Set session to expire in 7 days (7 * 24 * 60 * 60 * 1000 ms)
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
      };
      
      // Store in local storage for persistent session
      localStorage.setItem('counsellingSession', JSON.stringify(sessionData));
      localStorage.setItem('applicationId', formData.applicationId);
      
      // Redirect to counselling page with application ID
      navigate(`/counselling/overview?applicationId=${formData.applicationId}`);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrors({ submit: 'Failed to verify OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://hte.rajasthan.gov.in/css_index/images/s1old.jpg)',
          opacity: '0.3'
        }}
      ></div>
      
      <Header />
      
      <main className="flex-1 py-8 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Check Application Status
            </h1>
            <p className="text-gray-600 mb-4">Enter your application details to access counselling portal</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {!otpSent ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Details</h2>
                  <p className="text-gray-600">Provide your application ID and email address</p>
                </div>

                {/* Application ID */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Application ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="applicationId"
                      value={formData.applicationId}
                      onChange={handleInputChange}
                      placeholder="Enter Application ID (e.g., APP1757848425830718)"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.applicationId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.applicationId && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.applicationId}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your registered email address"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admission')}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Portal
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Mail size={20} className="mr-2" />
                    )}
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                  <p className="text-gray-600">
                    OTP sent to {formData.email && `${formData.email.slice(0, 3)}***@${formData.email.split('@')[1]}`}
                  </p>
                  
                </div>

                {/* OTP Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="Enter 4-digit OTP"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold tracking-widest ${
                        errors.otp ? 'border-red-500' : 'border-gray-300'
                      }`}
                      maxLength="4"
                    />
                  </div>
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.otp}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <ArrowRight size={20} className="mr-2" />
                    )}
                    {isLoading ? 'Verifying...' : 'Verify & Access Counselling'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StatusOtpPage;