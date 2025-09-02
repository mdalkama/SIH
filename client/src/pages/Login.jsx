import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await login(data.email, data.password, userType);
      console.log('Login successful:', result);

      // Role-based redirection
      if (userType === 'student') {
        navigate('/student');
      } else if (userType === 'staff') {
        const role = result.staff?.role;
        console.log('Staff role detected:', role);

        // Redirect based on staff role
        switch (role) {
          case 'UniversityAdmin':
            navigate('/staff/universityAdmin');
            break;
          case 'UniversityGoverningBody':
            navigate('/staff/universityGoverningBody');
            break;
          case 'UniversityRegistrar':
            navigate('/staff/universityRegistrar');
            break;
          case 'UniversityExaminationBody':
            navigate('/staff/universityExaminationBody');
            break;
          case 'UniversityFinanceBody':
            navigate('/staff/universityFinanceBody');
            break;
          case 'CollegeAdmin':
            navigate('/staff/collegeAdmin');
            break;
          case 'CollegeDirector':
            navigate('/staff/collegeDirector');
            break;
          case 'CollegeDean':
            navigate('/staff/collegeDean');
            break;
          case 'CollegeHOD':
            navigate('/staff/collegeHOD');
            break;
          case 'CollegeFaculty':
            navigate('/staff/collegeFaculty');
            break;
          case 'CollegeHostelWarden':
            navigate('/staff/collegeHostelWarden');
            break;
          case 'CollegeLibrarian':
            navigate('/staff/collegeLibrarian');
            break;
          case 'CollegeFinanceBody':
            navigate('/staff/collegeFinanceBody');
            break;
          default:
            console.warn('Unknown role:', role);
            navigate('/staff/collegeFaculty'); // Default fallback
        }
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid email or password.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Account is not active. Please contact administrator.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Login Form */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '48px 24px',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#3182ce',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <span style={{ color: 'white', fontSize: '32px' }}>🔐</span>
            </div>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#1a202c',
              marginBottom: '8px'
            }}>
              Student Management ERP
            </h2>
            <p style={{ fontSize: '14px', color: '#718096' }}>
              Secure Login Portal
            </p>
          </div>

          <div style={{ 
            background: 'white', 
            padding: '32px', 
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            borderTop: '4px solid #3182ce'
          }}>
            
            {/* User Type Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '12px'
              }}>
                Select User Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    border: userType === 'student' ? '2px solid #3182ce' : '2px solid #d1d5db',
                    borderRadius: '8px',
                    background: userType === 'student' ? '#eff6ff' : 'white',
                    color: userType === 'student' ? '#1e40af' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ marginRight: '8px', fontSize: '20px' }}>🎓</span>
                  <span style={{ fontWeight: '500' }}>Student</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('staff')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    border: userType === 'staff' ? '2px solid #3182ce' : '2px solid #d1d5db',
                    borderRadius: '8px',
                    background: userType === 'staff' ? '#eff6ff' : 'white',
                    color: userType === 'staff' ? '#1e40af' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ marginRight: '8px', fontSize: '20px' }}>👨‍💼</span>
                  <span style={{ fontWeight: '500' }}>Staff</span>
                </button>
              </div>
            </div>

            {error && (
              <div style={{ 
                marginBottom: '16px', 
                padding: '12px', 
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px'
              }}>
                <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }}>
                    👤
                  </div>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    placeholder="Enter your email address"
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '12px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3182ce'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                {errors.email && (
                  <p style={{ marginTop: '8px', fontSize: '14px', color: '#dc2626' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }}>
                    🔒
                  </div>
                  <input
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '40px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3182ce'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ marginTop: '8px', fontSize: '14px', color: '#dc2626' }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#374151' }}>
                  <input
                    type="checkbox"
                    style={{ marginRight: '8px', accentColor: '#3182ce' }}
                  />
                  Remember me
                </label>
                <a href="#" style={{ fontSize: '14px', color: '#3182ce', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: isLoading ? '#9ca3af' : '#3182ce',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!isLoading) e.target.style.background = '#2563eb';
                }}
                onMouseOut={(e) => {
                  if (!isLoading) e.target.style.background = '#3182ce';
                }}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }}></div>
                    Signing in...
                  </div>
                ) : (
                  `Sign in as ${userType === 'student' ? 'Student' : 'Staff'}`
                )}
              </button>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
                  Need help?{' '}
                  <a href="#" style={{ color: '#3182ce', textDecoration: 'none' }}>
                    Contact Administrator
                  </a>
                </p>
              </div>
            </form>

            {/* Government Footer */}
            <div style={{ 
              marginTop: '32px', 
              paddingTop: '24px', 
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                © 2024 Department of Technical Education, Government of Rajasthan
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                All rights reserved | Designed for educational institutions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
