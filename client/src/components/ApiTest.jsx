import React, { useState } from 'react';
import { authAPI } from '../services/authService';
import { getBaseURL } from '../config/api';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const testApiConnection = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // Test basic connection
      const response = await fetch(getBaseURL().replace('/api/v1', ''));
      results.baseConnection = {
        status: response.status,
        success: response.ok,
        message: response.ok ? 'Base URL accessible' : 'Base URL not accessible'
      };
    } catch (error) {
      results.baseConnection = {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }

    // Test student login endpoint (with invalid credentials to check if endpoint exists)
    try {
      await authAPI.loginStudent('test@test.com', 'invalid');
    } catch (error) {
      results.studentLogin = {
        endpointExists: error.response?.status !== 404,
        status: error.response?.status,
        message: error.response?.status === 400 ? 'Endpoint accessible (invalid credentials)' : 
                error.response?.status === 404 ? 'Endpoint not found' : 
                `Error: ${error.message}`
      };
    }

    // Test staff login endpoint (with invalid credentials to check if endpoint exists)
    try {
      await authAPI.loginStaff('test@test.com', 'invalid');
    } catch (error) {
      results.staffLogin = {
        endpointExists: error.response?.status !== 404,
        status: error.response?.status,
        message: error.response?.status === 400 ? 'Endpoint accessible (invalid credentials)' : 
                error.response?.status === 404 ? 'Endpoint not found' : 
                `Error: ${error.message}`
      };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>Base URL:</strong> {getBaseURL()}
        </p>
      </div>

      <button
        onClick={testApiConnection}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test API Connection'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Test Results:</h3>
          
          {testResults.baseConnection && (
            <div className={`p-3 rounded ${testResults.baseConnection.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <strong>Base Connection:</strong> {testResults.baseConnection.message}
              {testResults.baseConnection.status && (
                <span className="ml-2 text-sm">({testResults.baseConnection.status})</span>
              )}
            </div>
          )}

          {testResults.studentLogin && (
            <div className={`p-3 rounded ${testResults.studentLogin.endpointExists ? 'bg-green-100' : 'bg-red-100'}`}>
              <strong>Student Login Endpoint:</strong> {testResults.studentLogin.message}
              {testResults.studentLogin.status && (
                <span className="ml-2 text-sm">({testResults.studentLogin.status})</span>
              )}
            </div>
          )}

          {testResults.staffLogin && (
            <div className={`p-3 rounded ${testResults.staffLogin.endpointExists ? 'bg-green-100' : 'bg-red-100'}`}>
              <strong>Staff Login Endpoint:</strong> {testResults.staffLogin.message}
              {testResults.staffLogin.status && (
                <span className="ml-2 text-sm">({testResults.staffLogin.status})</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTest;
