import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setStudentData({
      name: user?.name || 'Student Name',
      registrationNumber: user?.registrationNumber || 'REG2024001',
      rollNumber: 'CS001',
      college: 'Government Engineering College',
      degree: 'B.Tech',
      branch: 'Computer Science',
      semester: 6,
      yearOfAdmission: 2022,
      status: 'active'
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
      {/* Logout Button - Top Right */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={handleLogout}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #3182ce 0%, #1e40af 100%)',
          borderRadius: '8px',
          padding: '24px',
          color: 'white',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            Welcome Student, {studentData?.name}!
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
            {studentData?.degree} {studentData?.branch} - Semester {studentData?.semester}
          </p>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: '4px 0 0 0' }}>
            Registration: {studentData?.registrationNumber} | Roll: {studentData?.rollNumber}
          </p>
        </div>

        {/* Student Services */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '24px' }}>
            Student Services
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: '📋', title: 'View Results', desc: 'Check exam results & grades' },
              { icon: '💰', title: 'Pay Fees', desc: 'Online fee payment portal' },
              { icon: '🏠', title: 'Hostel Services', desc: 'Room details & mess menu' },
              { icon: '📚', title: 'Library Portal', desc: 'Book issue/return & search' },
              { icon: '📅', title: 'Exam Schedule', desc: 'Upcoming exams & timetable' },
              { icon: '📄', title: 'Downloads', desc: 'Certificates & documents' },
              { icon: '📝', title: 'Attendance', desc: 'View attendance record' },
              { icon: '🎯', title: 'Assignments', desc: 'Submit assignments online' }
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  padding: '20px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = '#3182ce';
                  e.target.style.background = '#eff6ff';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = 'white';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{action.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>
                  {action.title}
                </div>
                <div style={{ fontSize: '12px', color: '#718096' }}>
                  {action.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;