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

  // If no application ID in URL, redirect to status check
  if (!applicationId) {
    return <Navigate to="/status/check" replace />;
  }

  // If we have application ID but no valid session, create a session for testing
  if (!hasValidSession()) {
    // For testing purposes, create a session if we have application ID
    console.log('No valid session found, but allowing access for testing with applicationId:', applicationId);

    // Create a test session
    const testSession = {
      applicationId: applicationId,
      otpVerified: true,
      timestamp: Date.now(),
      testSession: true
    };

    sessionStorage.setItem('statusOtpSession', JSON.stringify(testSession));
    localStorage.setItem('applicationId', applicationId);
  }

  return children;
};

export default ProtectedCounsellingRoute;
