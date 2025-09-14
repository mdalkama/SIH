import React from 'react';
import { Clock, LogOut, RefreshCw } from 'lucide-react';

const SessionExpiredModal = ({ isOpen, onReLogin, applicationId }) => {
  if (!isOpen) return null;

  const handleReLogin = () => {
    // Store the application ID for potential recovery
    if (applicationId) {
      localStorage.setItem('pendingApplicationId', applicationId);
    }
    onReLogin();
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Clock size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ⏳ Session Expired
          </h2>
          <p className="text-gray-600">
            Your session has timed out for security reasons.
          </p>
        </div>

        {/* Content */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold mb-1">
                Application Session Locked
              </h3>
              <p className="text-red-700 text-sm">
                Please re-login to continue your application. Your progress has been saved automatically.
              </p>
              {applicationId && (
                <p className="text-red-600 text-xs mt-2 font-mono">
                  Application ID: {applicationId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleReLogin}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <RefreshCw size={20} className="mr-2" />
            Re-Login to Continue
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut size={20} className="mr-2" />
            Go to Home Page
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Session timeout helps protect your personal information
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
