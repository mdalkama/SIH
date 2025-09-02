import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CollegeHODDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hodData, setHodData] = useState(null);

  useEffect(() => {
    fetchHODData();
  }, []);

  const fetchHODData = async () => {
    setHodData({
      name: user?.name || 'HOD Name',
      staffId: user?.staffId || 'HOD001',
      department: 'Computer Science Engineering',
      experience: 15,
      qualification: 'Ph.D in Computer Science',
      facultyCount: 25,
      studentCount: 450
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
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          borderRadius: '8px',
          padding: '24px',
          color: 'white',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px', marginRight: '16px' }}>👑</span>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                Welcome, Head of Department
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                {hodData?.name}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
            Department leadership and coordination | {hodData?.department}
          </p>
        </div>

        {/* HOD Management Actions */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '24px' }}>
            HOD Management Dashboard
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: '👨‍🏫', title: 'Faculty Management', desc: 'Manage department faculty' },
              { icon: '👥', title: 'Student Records', desc: 'View student information' },
              { icon: '📋', title: 'Course Planning', desc: 'Academic planning & curriculum' },
              { icon: '📊', title: 'Department Reports', desc: 'Performance analytics' },
              { icon: '📅', title: 'Schedule Management', desc: 'Timetable & exam scheduling' },
              { icon: '💰', title: 'Budget Planning', desc: 'Department budget management' },
              { icon: '🎯', title: 'Academic Goals', desc: 'Set department objectives' },
              { icon: '📝', title: 'Faculty Evaluation', desc: 'Performance reviews' }
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
                  e.target.style.borderColor = '#dc2626';
                  e.target.style.background = '#fef2f2';
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

export default CollegeHODDashboard;