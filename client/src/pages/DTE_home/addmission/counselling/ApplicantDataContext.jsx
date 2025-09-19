import React, { createContext, useContext, useState, useEffect } from 'react';
import applicantData from './applicant.json';

const ApplicantDataContext = createContext();

export const useApplicantData = () => {
  const context = useContext(ApplicantDataContext);
  if (!context) {
    throw new Error('useApplicantData must be used within an ApplicantDataProvider');
  }
  return context;
};

export const ApplicantDataProvider = ({ children, applicationId }) => {
  const [applicantInfo, setApplicantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApplicantData = () => {
      try {
        setLoading(true);
        
        // Find the applicant by application ID
        const applicant = applicantData.students[applicationId];
        
        if (!applicant) {
          setError(`Applicant with ID ${applicationId} not found`);
          return;
        }

        setApplicantInfo(applicant);
        setError(null);
      } catch (err) {
        setError('Failed to load applicant data');
        console.error('Error loading applicant data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      loadApplicantData();
    }
  }, [applicationId]);

  // Helper functions for data access
  const getPersonalInfo = () => applicantInfo?.personalInfo || {};
  const getExamResults = () => applicantInfo?.examResults || {};
  const getCounsellingStatus = () => applicantInfo?.counsellingStatus || {};
  const getCollegePreferences = () => applicantInfo?.collegePreferences || [];
  const getNotifications = () => applicantInfo?.notifications || [];
  const getDocuments = () => applicantInfo?.documents || [];
  const getCounsellingRounds = () => applicantData?.counsellingRounds || {};

  // Get current round info
  const getCurrentRound = () => {
    const counsellingStatus = getCounsellingStatus();
    const rounds = getCounsellingRounds();
    const currentRoundKey = `round${counsellingStatus.currentRound}`;
    return rounds[currentRoundKey] || {};
  };

  // Check if upward movement is locked
  const isUpwardMovementLocked = () => {
    const counsellingStatus = getCounsellingStatus();
    return counsellingStatus.hasReported || counsellingStatus.feesPaid;
  };

  // Get allotment status with color coding
  const getAllotmentStatus = () => {
    const counsellingStatus = getCounsellingStatus();
    return {
      ...counsellingStatus,
      statusColor: counsellingStatus.allotmentStatus === 'Allotted' 
        ? 'text-green-600 bg-green-100' 
        : counsellingStatus.allotmentStatus === 'Not Allotted'
        ? 'text-red-600 bg-red-100'
        : 'text-yellow-600 bg-yellow-100'
    };
  };

  // CRUD Operations
  const updatePersonalInfo = (updates) => {
    setApplicantInfo(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...updates
      }
    }));
  };

  const updateExamResults = (updates) => {
    setApplicantInfo(prev => ({
      ...prev,
      examResults: {
        ...prev.examResults,
        ...updates
      }
    }));
  };

  const updateCounsellingStatus = (updates) => {
    setApplicantInfo(prev => ({
      ...prev,
      counsellingStatus: {
        ...prev.counsellingStatus,
        ...updates
      }
    }));
  };

  const updateCollegePreferences = (preferences) => {
    setApplicantInfo(prev => ({
      ...prev,
      collegePreferences: preferences
    }));
  };

  const addCollegePreference = (preference) => {
    setApplicantInfo(prev => ({
      ...prev,
      collegePreferences: [...prev.collegePreferences, preference]
    }));
  };

  const removeCollegePreference = (index) => {
    setApplicantInfo(prev => ({
      ...prev,
      collegePreferences: prev.collegePreferences.filter((_, i) => i !== index)
    }));
  };

  const updateCollegePreference = (index, updates) => {
    setApplicantInfo(prev => ({
      ...prev,
      collegePreferences: prev.collegePreferences.map((pref, i) => 
        i === index ? { ...pref, ...updates } : pref
      )
    }));
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      message: notification.message,
      time: notification.time || new Date().toLocaleString(),
      read: false,
      type: notification.type || 'info'
    };
    
    setApplicantInfo(prev => ({
      ...prev,
      notifications: [newNotification, ...(prev.notifications || [])]
    }));
  };

  const markNotificationAsRead = (notificationId) => {
    setApplicantInfo(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    }));
  };

  const deleteNotification = (notificationId) => {
    setApplicantInfo(prev => ({
      ...prev,
      notifications: prev.notifications.filter(notification => notification.id !== notificationId)
    }));
  };

  const updateDocument = (documentId, updates) => {
    setApplicantInfo(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === documentId ? { ...doc, ...updates } : doc
      )
    }));
  };

  const submitDecision = (decisionType) => {
    const updates = {
      decision: decisionType,
      decisionDate: new Date().toISOString().split('T')[0],
      decisionTime: new Date().toLocaleTimeString()
    };
    
    if (decisionType === 'freeze') {
      updates.hasReported = true;
      updates.feesPaid = true;
    }
    
    updateCounsellingStatus(updates);
    
    // Add notification
    addNotification({
      message: `Your decision to ${decisionType} has been submitted successfully.`,
      type: 'success'
    });
  };

  const processFeePayment = () => {
    updateCounsellingStatus({
      feesPaid: true,
      feePaymentDate: new Date().toISOString().split('T')[0]
    });
    
    addNotification({
      message: 'Fee payment completed successfully. Your seat has been confirmed.',
      type: 'success'
    });
  };

  const processDocumentVerification = () => {
    updateCounsellingStatus({
      documentsVerified: true,
      documentVerificationDate: new Date().toISOString().split('T')[0]
    });
    
    addNotification({
      message: 'Documents verified successfully. You can now proceed with reporting.',
      type: 'success'
    });
  };

  const processReporting = () => {
    updateCounsellingStatus({
      hasReported: true,
      reportingDate: new Date().toISOString().split('T')[0]
    });
    
    addNotification({
      message: 'Reporting completed successfully. Your admission process is complete.',
      type: 'success'
    });
  };

  const submitUpwardMovement = (movementData) => {
    updateCounsellingStatus({
      upwardMovementSubmitted: true,
      upwardMovementRound: movementData.round,
      upwardMovementDate: new Date().toISOString().split('T')[0],
      upwardMovementTime: new Date().toLocaleTimeString()
    });
    
    addNotification({
      message: `Upward movement submitted for Round ${movementData.round + 1}. You will be considered for higher preferences.`,
      type: 'success'
    });
  };

  const value = {
    applicantInfo,
    loading,
    error,
    getPersonalInfo,
    getExamResults,
    getCounsellingStatus,
    getCollegePreferences,
    getNotifications,
    getDocuments,
    getCounsellingRounds,
    getCurrentRound,
    isUpwardMovementLocked,
    getAllotmentStatus,
    // CRUD Operations
    updatePersonalInfo,
    updateExamResults,
    updateCounsellingStatus,
    updateCollegePreferences,
    addCollegePreference,
    removeCollegePreference,
    updateCollegePreference,
    addNotification,
    markNotificationAsRead,
    deleteNotification,
    updateDocument,
    submitDecision,
    processFeePayment,
    processDocumentVerification,
    processReporting,
    submitUpwardMovement,
    applicationId
  };

  return (
    <ApplicantDataContext.Provider value={value}>
      {children}
    </ApplicantDataContext.Provider>
  );
};
