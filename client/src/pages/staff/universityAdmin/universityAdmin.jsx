import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UniversityAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setAdminData({
      name: user?.name || 'Admin Name',
      staffId: user?.staffId || 'ADMIN001',
      role: 'University Administrator',
      totalColleges: 25,
      totalStudents: 15000,
      totalStaff: 850,
      totalRevenue: 50000000
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
            <span style={{ fontSize: '32px', marginRight: '16px' }}>🏛️</span>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                Welcome, University Administrator
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                {adminData?.name}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
            Complete university management access and control
          </p>
        </div>

        {/* University Stats */}
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
            borderLeft: '4px solid #dc2626'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🏢</span>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', margin: 0 }}>
                University Overview
              </h3>
            </div>
            <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>
              <p style={{ margin: '8px 0' }}><strong>Total Colleges:</strong> {adminData?.totalColleges}</p>
              <p style={{ margin: '8px 0' }}><strong>Total Students:</strong> {adminData?.totalStudents?.toLocaleString()}</p>
              <p style={{ margin: '8px 0' }}><strong>Total Staff:</strong> {adminData?.totalStaff}</p>
              <p style={{ margin: '8px 0' }}><strong>Annual Revenue:</strong> ₹{(adminData?.totalRevenue / 10000000)?.toFixed(1)}Cr</p>
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
            University Administration Dashboard
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: '🏢', title: 'College Management', desc: 'Manage all colleges' },
              { icon: '👥', title: 'Staff Management', desc: 'University-wide staff' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'University analytics' },
              { icon: '💰', title: 'Financial Management', desc: 'Budget & revenue' },
              { icon: '⚙️', title: 'System Settings', desc: 'Configure system' },
              { icon: '📋', title: 'Policy Management', desc: 'University policies' },
              { icon: '🎯', title: 'Strategic Planning', desc: 'Long-term planning' },
              { icon: '📄', title: 'Reports & Compliance', desc: 'Regulatory reports' }
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

export default UniversityAdminDashboard;