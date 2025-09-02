import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed
  if (allowedRoles.length > 0) {
    // For student routes
    if (allowedRoles.includes('student') && user.userType === 'student') {
      return children;
    }

    // For staff routes - check specific role
    if (user.userType === 'staff' && allowedRoles.includes(user.role)) {
      return children;
    }

    // If role doesn't match, redirect based on user type
    if (user.userType === 'student') {
      return <Navigate to="/student" replace />;
    } else if (user.userType === 'staff') {
      // Redirect to appropriate staff dashboard based on role
      const role = user.role;
      const roleRoutes = {
        'UniversityAdmin': '/staff/universityAdmin',
        'UniversityGoverningBody': '/staff/universityGoverningBody',
        'UniversityRegistrar': '/staff/universityRegistrar',
        'UniversityExaminationBody': '/staff/universityExaminationBody',
        'UniversityFinanceBody': '/staff/universityFinanceBody',
        'CollegeAdmin': '/staff/collegeAdmin',
        'CollegeDirector': '/staff/collegeDirector',
        'CollegeDean': '/staff/collegeDean',
        'CollegeHOD': '/staff/collegeHOD',
        'CollegeFaculty': '/staff/collegeFaculty',
        'CollegeHostelWarden': '/staff/collegeHostelWarden',
        'CollegeLibrarian': '/staff/collegeLibrarian',
        'CollegeFinanceBody': '/staff/collegeFinanceBody'
      };
      return <Navigate to={roleRoutes[role] || '/staff/collegeFaculty'} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
