import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/student/student';

// Staff Pages - University Level
import UniversityAdminDashboard from './pages/staff/universityAdmin/universityAdmin';
import UniversityGoverningBodyDashboard from './pages/staff/universityGoverningBody/universityGoverningBody';
import UniversityRegistrarDashboard from './pages/staff/universityRegistrar/universityRegistrar';
import UniversityExaminationBodyDashboard from './pages/staff/universityExaminationBody/universityExaminationBody';
import UniversityFinanceBodyDashboard from './pages/staff/universityFinanceBody/universityFinanceBody';

// Staff Pages - College Level
import CollegeAdminDashboard from './pages/staff/collegeAdmin/collegeAdmin';
import CollegeDirectorDashboard from './pages/staff/collegeDirector/collegeDirector';
import CollegeDeanDashboard from './pages/staff/collegeDean/collegeDean';
import CollegeHODDashboard from './pages/staff/collegeHOD/collegeHOD';
import CollegeFacultyDashboard from './pages/staff/collegeFaculty/collegeFaculty';
import CollegeHostelWardenDashboard from './pages/staff/collegeHostelWarden/collegeHostelWarden';
import CollegeLibrarianDashboard from './pages/staff/collegeLibrarian/collegeLibrarian';
import CollegeFinanceBodyDashboard from './pages/staff/collegeFinanceBody/collegeFinanceBody';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* University Level Staff Routes */}
            <Route
              path="/staff/universityAdmin"
              element={
                <ProtectedRoute allowedRoles={['UniversityAdmin']}>
                  <UniversityAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/universityGoverningBody"
              element={
                <ProtectedRoute allowedRoles={['UniversityGoverningBody']}>
                  <UniversityGoverningBodyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/universityRegistrar"
              element={
                <ProtectedRoute allowedRoles={['UniversityRegistrar']}>
                  <UniversityRegistrarDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/universityExaminationBody"
              element={
                <ProtectedRoute allowedRoles={['UniversityExaminationBody']}>
                  <UniversityExaminationBodyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/universityFinanceBody"
              element={
                <ProtectedRoute allowedRoles={['UniversityFinanceBody']}>
                  <UniversityFinanceBodyDashboard />
                </ProtectedRoute>
              }
            />

            {/* College Level Staff Routes */}
            <Route
              path="/staff/collegeAdmin"
              element={
                <ProtectedRoute allowedRoles={['CollegeAdmin']}>
                  <CollegeAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/collegeDirector"
              element={
                <ProtectedRoute allowedRoles={['CollegeDirector']}>
                  <CollegeDirectorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/collegeDean"
              element={
                <ProtectedRoute allowedRoles={['CollegeDean']}>
                  <CollegeDeanDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/collegeHOD"
              element={
                <ProtectedRoute allowedRoles={['CollegeHOD']}>
                  <CollegeHODDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/collegeFaculty"
              element={
                <ProtectedRoute allowedRoles={['CollegeFaculty']}>
                  <CollegeFacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/collegeHostelWarden"
              element={
                <ProtectedRoute allowedRoles={['CollegeHostelWarden']}>
                  <CollegeHostelWardenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/collegeLibrarian"
              element={
                <ProtectedRoute allowedRoles={['CollegeLibrarian']}>
                  <CollegeLibrarianDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/collegeFinanceBody"
              element={
                <ProtectedRoute allowedRoles={['CollegeFinanceBody']}>
                  <CollegeFinanceBodyDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
