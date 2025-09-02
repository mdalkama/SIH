import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UniversityGoverningBodyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [governingData, setGoverningData] = useState(null);

  useEffect(() => {
    fetchGoverningData();
  }, []);

  const fetchGoverningData = async () => {
    setGoverningData({
      name: user?.name || 'Governing Body Member',
      staffId: user?.staffId || 'GOV001',
      position: 'Board Member',
      totalPolicies: 45,
      pendingApprovals: 8,
      meetingsScheduled: 3
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
          background: 'linear-gradient(135deg, #7c2d12 0%, #92400e 100%)',
          borderRadius: '8px',
          padding: '24px',
          color: 'white',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px', marginRight: '16px' }}>⚖️</span>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                Welcome, University Governing Body
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                {governingData?.name}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
            Policy and governance oversight
          </p>
        </div>

        {/* Governing Body Actions */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '24px' }}>
            Governing Body Dashboard
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: '⚖️', title: 'Policy Management', desc: 'University policies' },
              { icon: '📋', title: 'Governance Oversight', desc: 'Oversight functions' },
              { icon: '🤝', title: 'Board Meetings', desc: 'Schedule & manage meetings' },
              { icon: '📊', title: 'Performance Review', desc: 'University performance' },
              { icon: '✅', title: 'Approvals', desc: 'Policy approvals' },
              { icon: '📈', title: 'Strategic Planning', desc: 'Long-term strategy' },
              { icon: '🔍', title: 'Compliance Monitoring', desc: 'Regulatory compliance' },
              { icon: '📄', title: 'Documentation', desc: 'Governance documents' }
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
                  e.target.style.borderColor = '#7c2d12';
                  e.target.style.background = '#fef7ed';
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

export default UniversityGoverningBodyDashboard;