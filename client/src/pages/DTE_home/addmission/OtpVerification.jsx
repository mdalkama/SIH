import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const OtpVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('user') || 'Applicant';
  const courseId = searchParams.get('courseId');

  const [step, setStep] = useState(1); // 1: Phone & Email, 2: OTP Verification
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Course options based on admission types
  const courseOptions = {
    'diploma-engineering-first-year': {
      name: 'Diploma Engineering (1st Year)',
      description: 'First Year Diploma Engineering Courses'
    },
    'diploma-engineering-lateral-entry': {
      name: 'Diploma Engineering (Lateral Entry)',
      description: 'Lateral Entry Diploma Engineering Courses'
    },
    'diploma-non-engineering-first-year': {
      name: 'Diploma Non-Engineering (1st Year)',
      description: 'First Year Diploma Non-Engineering Courses'
    },
    'diploma-non-engineering-second-year-graduate': {
      name: 'Diploma Non-Engineering (2nd Year Graduate)',
      description: 'Second Year Graduate Non-Engineering Courses'
    },
    'diploma-non-engineering-first-year-degree': {
      name: 'Diploma Non-Engineering (1st Year Degree)',
      description: 'First Year Degree Non-Engineering Courses'
    },
    'engineering': {
      name: 'Diploma Engineering',
      description: 'Diploma Engineering Courses'
    },
    'non-engineering': {
      name: 'Diploma Non-Engineering',
      description: 'Diploma Non-Engineering Courses'
    },
    'bsc-first-year': {
      name: 'B.Sc (1st Year)',
      description: 'Bachelor of Science First Year'
    },
    'iti-courses': {
      name: 'ITI Courses',
      description: 'Industrial Training Institute Courses'
    }
  };

  const selectedCourse = courseOptions[courseId];

  // Redirect if no course ID provided
  useEffect(() => {
    if (!courseId || !selectedCourse) {
      navigate('/');
      return;
    }
  }, [courseId, selectedCourse, navigate]);

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

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp !== '1235') {
      newErrors.otp = 'Invalid OTP. Please enter 1235 for demo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOtpSent(true);
    setStep(2);
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user has existing session data
    const existingApplicationId = localStorage.getItem('currentApplicationId');
    let applicationId = existingApplicationId;
    
    if (!applicationId) {
      // Generate new application ID if none exists
      applicationId = `APP${Date.now()}${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('currentApplicationId', applicationId);
    }
    
    // Store/update application data in localStorage
    const applicationData = {
      applicationId,
      courseId: courseId,
      courseName: selectedCourse?.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      createdAt: new Date().toISOString(),
      status: 'in_progress',
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem(`application_${applicationId}`, JSON.stringify(applicationData));
    
    setIsLoading(false);
    
    // Redirect to application form with course ID and application ID
    navigate(`/application/${courseId}?applicationId=${applicationId}`);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setOtpSent(false);
      setFormData(prev => ({ ...prev, otp: '' }));
    } else {
      navigate('/');
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
              Admission Portal
            </h1>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-blue-900 mb-1">Selected Course:</h3>
              <p className="text-blue-800 font-medium">{selectedCourse?.name || 'Course not found'}</p>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'} font-semibold`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'} font-semibold`}>
              2
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {step === 1 ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Your Details</h2>
                  <p className="text-gray-600">Provide your contact information to proceed</p>
                </div>

                {/* Phone Number */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit mobile number"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      maxLength="10"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.phoneNumber}
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
                      placeholder="Enter your email address"
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
                    onClick={handleBack}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Home
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
                      <Phone size={20} className="mr-2" />
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
                    OTP sent to +91{formData.phoneNumber.slice(0, -3)}***
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center text-green-800">
                      <CheckCircle size={20} className="mr-2" />
                      <span className="font-medium">Use OTP: 1235 for demo</span>
                    </div>
                  </div>
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
                    onClick={handleBack}
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
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
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

export default OtpVerification;
