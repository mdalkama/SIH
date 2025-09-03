import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

// Styles}

// Pages
import Login from './pages/MyLogin.jsx';

// Student Pages
import StudentDashboard from './pages/Profile.jsx';

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
      <UserProvider>
        <Login />
      </UserProvider>
    </Router>
  );
}

export default App;
