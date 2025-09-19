import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

const ProtectedCounsellingRoute = ({ children }) => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  
  // Check if user has valid session from status OTP verification
  const hasValidSession = () => {
    try {
      const sessionData = sessionStorage.getItem('statusOtpSession');
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      const currentTime = Date.now();
      const sessionTime = session.timestamp;
      
      // Session valid for 1 hour (3600000 ms)
      const isSessionValid = (currentTime - sessionTime) < 3600000;
      const hasApplicationId = session.applicationId === applicationId;
      
      return isSessionValid && hasApplicationId && session.otpVerified;
    } catch (error) {
      return false;
    }
  };

  // If no application ID in URL or no valid session, redirect to status check
  if (!applicationId || !hasValidSession()) {
    return <Navigate to="/status/check" replace />;
  }

  return children;
};

export default ProtectedCounsellingRoute;
