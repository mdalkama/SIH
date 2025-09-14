import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Application from '../../../components/Application/Application.jsx';
import SessionTimer from '../../../components/SessionTimer/SessionTimer.jsx';
import SessionExpiredModal from '../../../components/SessionTimer/SessionExpiredModal.jsx';

const ApplicationWrapper = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const applicationId = searchParams.get('applicationId');
  
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [sessionTime, setSessionTime] = useState(120); // 2 minutes default

  // Course configuration mapping
  const courseConfig = {
    'diploma-engineering-first-year': {
      formName: 'Diploma Engineering First Year Admission Form 2025',
      admissionType: 'diploma',
      sessionYear: '2025'
    },
    'diploma-engineering-lateral-entry': {
      formName: 'Diploma Engineering Lateral Entry Admission Form 2025',
      admissionType: 'diploma',
      sessionYear: '2025'
    },
    'diploma-non-engineering-first-year': {
      formName: 'Diploma Non-Engineering First Year Admission Form 2025',
      admissionType: 'diploma',
      sessionYear: '2025'
    },
    'diploma-non-engineering-second-year-graduate': {
      formName: 'Diploma Non-Engineering Second Year Graduate Admission Form 2025',
      admissionType: 'diploma',
      sessionYear: '2025'
    },
    'diploma-non-engineering-first-year-degree': {
      formName: 'Diploma Non-Engineering First Year Degree Admission Form 2025',
      admissionType: 'degree',
      sessionYear: '2025'
    },
    'bsc-first-year': {
      formName: 'B.Sc First Year Admission Form 2025',
      admissionType: 'degree',
      sessionYear: '2025'
    },
    'iti-courses': {
      formName: 'ITI Courses Admission Form 2025',
      admissionType: 'iti',
      sessionYear: '2025'
    }
  };

  const currentConfig = courseConfig[courseId] || {
    formName: 'Admission Form 2025',
    admissionType: 'diploma',
    sessionYear: '2025'
  };

  useEffect(() => {
    // Validate application ID and course ID
    if (!applicationId || !courseId) {
      navigate('/admission/otp-verification');
      return;
    }

    // Check if application exists in localStorage
    const applicationData = localStorage.getItem(`application_${applicationId}`);
    if (!applicationData) {
      navigate('/admission/otp-verification');
      return;
    }

    // Parse and validate application data
    try {
      const parsedData = JSON.parse(applicationData);
      if (parsedData.courseId !== courseId) {
        navigate('/admission/otp-verification');
        return;
      }
    } catch (error) {
      navigate('/admission/otp-verification');
      return;
    }

    // Set session time based on course type (for demo purposes)
    const sessionDuration = getSessionDuration(courseId);
    setSessionTime(sessionDuration);
  }, [applicationId, courseId, navigate]);

  const getSessionDuration = (courseId) => {
    // Different session durations for different courses (in seconds)
    const durations = {
      'diploma-engineering-first-year': 180, // 3 minutes
      'diploma-engineering-lateral-entry': 180, // 3 minutes
      'diploma-non-engineering-first-year': 120, // 2 minutes
      'diploma-non-engineering-second-year-graduate': 150, // 2.5 minutes
      'diploma-non-engineering-first-year-degree': 180, // 3 minutes
      'bsc-first-year': 180, // 3 minutes
      'iti-courses': 120 // 2 minutes
    };
    
    return durations[courseId] || 120; // Default 2 minutes
  };

  const handleSessionExpire = () => {
    setIsSessionActive(false);
    setShowExpiredModal(true);
    
    // Update application status in localStorage
    if (applicationId) {
      const applicationData = localStorage.getItem(`application_${applicationId}`);
      if (applicationData) {
        try {
          const parsedData = JSON.parse(applicationData);
          parsedData.status = 'session_expired';
          parsedData.sessionExpiredAt = new Date().toISOString();
          localStorage.setItem(`application_${applicationId}`, JSON.stringify(parsedData));
        } catch (error) {
          console.error('Error updating application status:', error);
        }
      }
    }
  };

  const handleReLogin = () => {
    // Redirect to OTP verification with course pre-selected
    navigate(`/admission/otp-verification?courseId=${courseId}&relogin=true`);
  };

  // Don't render anything if session validation fails
  if (!applicationId || !courseId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Session Timer */}
      <SessionTimer
        initialTime={sessionTime}
        onSessionExpire={handleSessionExpire}
        isActive={isSessionActive}
        showWarningAt={30}
      />

      {/* Session Status Indicator */}
      {isSessionActive && (
        <div className="bg-green-50 border-b border-green-200 py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">
                Session Active - Application ID: {applicationId}
              </span>
            </div>
            <div className="text-sm text-green-600">
              Course: {currentConfig.formName.split(' ').slice(0, 3).join(' ')}
            </div>
          </div>
        </div>
      )}

      {/* Application Form */}
      {isSessionActive ? (
        <Application
          formName={currentConfig.formName}
          logoUrl="https://svumshow.com/assets/images/department-logo/pngwing.png"
          admissionType={currentConfig.admissionType}
          sessionYear={currentConfig.sessionYear}
          applicationId={applicationId}
          courseId={courseId}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Session Expired</h2>
            <p className="text-gray-600 mb-4">
              Your application session has expired. The form is now locked.
            </p>
            <button
              onClick={handleReLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Re-Login to Continue
            </button>
          </div>
        </div>
      )}

      {/* Session Expired Modal */}
      <SessionExpiredModal
        isOpen={showExpiredModal}
        onReLogin={handleReLogin}
        applicationId={applicationId}
      />
    </div>
  );
};

export default ApplicationWrapper;
