import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CollegeFacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [facultyData, setFacultyData] = useState(null);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    setFacultyData({
      name: user?.name || 'Faculty Name',
      staffId: user?.staffId || 'FAC001',
      department: 'Computer Science Engineering',
      designation: 'Assistant Professor',
      subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
      experience: 8,
      qualification: 'M.Tech in Computer Science'
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
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          borderRadius: '8px',
          padding: '24px',
          color: 'white',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px', marginRight: '16px' }}>👨‍🏫</span>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                Welcome, Faculty Member
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                {facultyData?.name}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
            {facultyData?.designation} | {facultyData?.department}
          </p>
        </div>

        {/* Faculty Information */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #059669'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>📚</span>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', margin: 0 }}>
                Teaching Information
              </h3>
            </div>
            <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>
              <p style={{ margin: '8px 0' }}><strong>Designation:</strong> {facultyData?.designation}</p>
              <p style={{ margin: '8px 0' }}><strong>Department:</strong> {facultyData?.department}</p>
              <p style={{ margin: '8px 0' }}><strong>Experience:</strong> {facultyData?.experience} years</p>
              <p style={{ margin: '8px 0' }}><strong>Qualification:</strong> {facultyData?.qualification}</p>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #3182ce'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>📖</span>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', margin: 0 }}>
                Assigned Subjects
              </h3>
            </div>
            <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>
              {facultyData?.subjects?.map((subject, index) => (
                <p key={index} style={{ margin: '8px 0', padding: '4px 8px', background: '#eff6ff', borderRadius: '4px' }}>
                  {subject}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Faculty Actions */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '24px' }}>
            Faculty Dashboard
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: '📚', title: 'My Subjects', desc: 'Teaching assignments' },
              { icon: '📝', title: 'Mark Attendance', desc: 'Student attendance' },
              { icon: '🎯', title: 'Assignments', desc: 'Create & manage assignments' },
              { icon: '📊', title: 'Grade Students', desc: 'Enter marks & grades' },
              { icon: '📅', title: 'Class Schedule', desc: 'View teaching timetable' },
              { icon: '👥', title: 'My Students', desc: 'View assigned students' },
              { icon: '📋', title: 'Lesson Plans', desc: 'Create lesson plans' },
              { icon: '📄', title: 'Reports', desc: 'Generate academic reports' }
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
                  e.target.style.borderColor = '#059669';
                  e.target.style.background = '#f0fdf4';
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

export default CollegeFacultyDashboard;