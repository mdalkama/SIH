import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const OtpVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';

  const [step, setStep] = useState(1); // 1: Course Selection & Phone, 2: OTP Verification
  const [formData, setFormData] = useState({
    selectedCourse: '',
    phoneNumber: '',
    email: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Course options based on admission types
  const courseOptions = [
    {
      id: 'diploma-engineering-first-year',
      name: 'Diploma Engineering (1st Year)',
      description: 'First Year Diploma Engineering Courses'
    },
    {
      id: 'diploma-engineering-lateral-entry',
      name: 'Diploma Engineering (Lateral Entry)',
      description: 'Lateral Entry Diploma Engineering Courses'
    },
    {
      id: 'diploma-non-engineering-first-year',
      name: 'Diploma Non-Engineering (1st Year)',
      description: 'First Year Diploma Non-Engineering Courses'
    },
    {
      id: 'diploma-non-engineering-second-year-graduate',
      name: 'Diploma Non-Engineering (2nd Year Graduate)',
      description: 'Second Year Graduate Non-Engineering Courses'
    },
    {
      id: 'diploma-non-engineering-first-year-degree',
      name: 'Diploma Non-Engineering (1st Year Degree)',
      description: 'First Year Degree Non-Engineering Courses'
    },
    {
      id: 'bsc-first-year',
      name: 'B.Sc (1st Year)',
      description: 'Bachelor of Science First Year'
    },
    {
      id: 'iti-courses',
      name: 'ITI Courses',
      description: 'Industrial Training Institute Courses'
    }
  ];

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
    
    if (!formData.selectedCourse) {
      newErrors.selectedCourse = 'Please select a course';
    }
    
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
    
    // Generate application ID
    const applicationId = `APP${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Store application data in localStorage for demo
    const applicationData = {
      applicationId,
      courseId: formData.selectedCourse,
      courseName: courseOptions.find(c => c.id === formData.selectedCourse)?.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      createdAt: new Date().toISOString(),
      status: 'in_progress'
    };
    
    localStorage.setItem(`application_${applicationId}`, JSON.stringify(applicationData));
    localStorage.setItem('currentApplicationId', applicationId);
    
    setIsLoading(false);
    
    // Redirect to application form with course ID
    navigate(`/application/${formData.selectedCourse}?applicationId=${applicationId}`);
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Admission Portal
            </h1>
            <p className="text-gray-600">Role: {role.charAt(0).toUpperCase() + role.slice(1)}</p>
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Course & Enter Details</h2>
                  <p className="text-gray-600">Choose your course and provide your contact information</p>
                </div>

                {/* Course Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-blue-900 mb-3">
                    Select Course <span className="text-red-500">*</span>
                  </label>
                  <div className="grid gap-3">
                    {courseOptions.map((course) => (
                      <label key={course.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="selectedCourse"
                          value={course.id}
                          checked={formData.selectedCourse === course.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                          formData.selectedCourse === course.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              formData.selectedCourse === course.id
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-300'
                            }`}>
                              {formData.selectedCourse === course.id && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{course.name}</h3>
                              <p className="text-sm text-gray-600">{course.description}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.selectedCourse && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.selectedCourse}
                    </p>
                  )}
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

                {/* Course Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-1">Selected Course:</h3>
                  <p className="text-blue-800">
                    {courseOptions.find(c => c.id === formData.selectedCourse)?.name}
                  </p>
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
