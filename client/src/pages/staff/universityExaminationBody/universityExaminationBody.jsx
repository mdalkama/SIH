import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UniversityExaminationBodyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    setExamData({
      name: user?.name || 'Exam Officer Name',
      staffId: user?.staffId || 'EXAM001',
      upcomingExams: 15,
      resultsPublished: 8,
      pendingEvaluations: 120,
      totalExaminees: 12000
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
            <span style={{ fontSize: '32px', marginRight: '16px' }}>📝</span>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                Welcome, University Examination Body
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                {examData?.name}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
            Examination management and results processing
          </p>
        </div>

        {/* Examination Actions */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '24px' }}>
            Examination Management Dashboard
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: '📅', title: 'Exam Scheduling', desc: 'Schedule examinations' },
              { icon: '📝', title: 'Question Papers', desc: 'Manage question papers' },
              { icon: '📊', title: 'Result Processing', desc: 'Process exam results' },
              { icon: '🎯', title: 'Evaluation Management', desc: 'Manage evaluations' },
              { icon: '📋', title: 'Exam Registration', desc: 'Student exam registration' },
              { icon: '🏆', title: 'Result Publication', desc: 'Publish results' },
              { icon: '📄', title: 'Certificates', desc: 'Issue certificates' },
              { icon: '📈', title: 'Analytics', desc: 'Exam performance analytics' }
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

export default UniversityExaminationBodyDashboard;