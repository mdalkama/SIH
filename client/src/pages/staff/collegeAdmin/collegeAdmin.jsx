import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CollegeAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setAdminData({
      name: user?.name || 'Admin Name',
      staffId: user?.staffId || 'CADM001',
      collegeName: 'Government Engineering College',
      totalStudents: 1200,
      totalFaculty: 85,
      totalDepartments: 8,
      pendingApplications: 25
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
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
          borderRadius: '8px',
          padding: '24px',
          color: 'white',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px', marginRight: '16px' }}>🏢</span>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                Welcome, College Administrator
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                {adminData?.name}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
            College-level administrative control | {adminData?.collegeName}
          </p>
        </div>

        {/* College Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #7c3aed'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🏢</span>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', margin: 0 }}>
                College Overview
              </h3>
            </div>
            <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>
              <p style={{ margin: '8px 0' }}><strong>College:</strong> {adminData?.collegeName}</p>
              <p style={{ margin: '8px 0' }}><strong>Total Students:</strong> {adminData?.totalStudents}</p>
              <p style={{ margin: '8px 0' }}><strong>Total Faculty:</strong> {adminData?.totalFaculty}</p>
              <p style={{ margin: '8px 0' }}><strong>Departments:</strong> {adminData?.totalDepartments}</p>
              <p style={{ margin: '8px 0' }}><strong>Pending Applications:</strong> {adminData?.pendingApplications}</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '24px' }}>
            College Administration Dashboard
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: '👥', title: 'Student Management', desc: 'Manage all students' },
              { icon: '👨‍🏫', title: 'Faculty Management', desc: 'Faculty administration' },
              { icon: '📋', title: 'Admission Management', desc: 'Handle admissions' },
              { icon: '💰', title: 'Fee Management', desc: 'College fee collection' },
              { icon: '🏠', title: 'Hostel Administration', desc: 'Hostel management' },
              { icon: '📚', title: 'Academic Management', desc: 'Academic operations' },
              { icon: '📊', title: 'College Reports', desc: 'Performance reports' },
              { icon: '⚙️', title: 'College Settings', desc: 'Configure college' }
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
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.background = '#faf5ff';
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

export default CollegeAdminDashboard;