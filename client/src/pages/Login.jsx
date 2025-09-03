import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');
  const [scaleLevel, setScaleLevel] = useState(1.0); // Default scale level
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Apply scale to the body element for global scaling
    document.body.style.transform = `scale(${scaleLevel})`;
    document.body.style.transformOrigin = 'top center';
    document.body.style.transition = 'transform 0.2s ease-in-out'; // Smooth transition
  }, [scaleLevel]);

  const increaseZoom = () => {
    setScaleLevel(prev => Math.min(prev + 0.1, 1.5)); // Max scale 1.5 (150%)
  };

  const resetZoom = () => {
    setScaleLevel(1.0); // Reset to 1.0 (100%)
  };

  const decreaseZoom = () => {
    setScaleLevel(prev => Math.max(prev - 0.1, 0.7)); // Min scale 0.7 (70%)
  };

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
    <div style={{ 
      height: '100vh', 
      background: '#f0f2f5',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Government Header */}
      <header style={{
        width: '100%',
        background: '#1e3a8a',
        color: 'white',
        padding: '8px 0', /* Increased padding */
        borderBottom: '2px solid #ff6b35' /* Thicker border */
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 25px' /* Increased horizontal padding */
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '70px', /* Further increased icon container size */
              height: '70px',
              marginRight: '20px', /* Increased margin */
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="https://numberonejobsite.in/wp-content/uploads/2022/02/320px-Emblem_Rajasthan.png" 
                alt="Rajasthan Government Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'invert(100%)' }}
              />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: 'white', fontFamily: 'Arial, sans-serif' }}>University ERP Management System</h1> {/* Increased font size */}
              <p style={{ fontSize: '13px', margin: '2px 0 0 0' }}>Department of Technical Education, Rajasthan</p> {/* Increased font size */}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '15px' }}> {/* Increased margin */}
              <div style={{ fontSize: '13px', fontWeight: '500' }}>Secure Login Portal</div> {/* Larger font */}
              <div style={{ fontSize: '11px' }}>Access your account securely</div> {/* Larger font */}
            </div>
            <button onClick={increaseZoom} style={{
              background: '#0f2557',
              color: 'white',
              border: 'none',
              borderRadius: '3px', /* Slightly more rounded */
              padding: '3px 6px', /* Increased padding */
              fontSize: '12px', /* Larger font */
              marginLeft: '8px', /* Increased margin */
              cursor: 'pointer'
            }}>A+</button>
            <button onClick={resetZoom} style={{
              background: '#0f2557',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '3px 6px',
              fontSize: '12px',
              marginLeft: '8px',
              cursor: 'pointer'
            }}>A</button>
            <button onClick={decreaseZoom} style={{
              background: '#0f2557',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '3px 6px',
              fontSize: '12px',
              marginLeft: '8px',
              cursor: 'pointer'
            }}>A-</button>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        flex: '1',
        padding: '10px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '340px', margin: '0 auto', width: '100%' }}>

          <div style={{ 
            background: 'white', 
            padding: '0', 
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #d1d5db',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#1e3a8a',
              padding: '8px 15px',
              marginBottom: '12px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              Sign in to your account
            </div>
            
            <div style={{ padding: '0 15px 15px' }}>
            
            {/* User Type Selection */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '6px'
              }}>
                Select User Type
              </label>
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid #d1d5db',
                marginBottom: '5px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 0',
                    background: 'transparent',
                    border: 'none',
                    color: userType === 'student' ? '#1e3a8a' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: userType === 'student' ? '600' : '400',
                    position: 'relative',
                    zIndex: 1,
                    fontSize: '12px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '5px' }}>
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                  </svg>
                  <span>Student</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('staff')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 0',
                    background: 'transparent',
                    border: 'none',
                    color: userType === 'staff' ? '#1e3a8a' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: userType === 'staff' ? '600' : '400',
                    position: 'relative',
                    zIndex: 1,
                    fontSize: '12px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '5px' }}>
                    <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384c0 .853.61 1.574 1.457 1.75l.73.184c.116.029.23.048.346.06V14.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V7.828c.31-.053.6-.17.86-.342.2-.132.4-.364.4-.66V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3ZM4.5 3V2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5V3zM14 4.5V6a.5.5 0 0 1-.5.5H.5A.5.5 0 0 1 0 6V4.5A.5.5 0 0 1 .5 4H14a.5.5 0 0 1 .5.5"/>
                  </svg>
                  <span>Staff</span>
                </button>
                
                {/* Animated underline */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: userType === 'student' ? '0%' : '50%',
                  width: '50%',
                  height: '2px',
                  background: '#1e3a8a',
                  transition: 'left 0.2s ease-in-out'
                }}></div>
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
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#4b5563',
                    fontSize: '16px'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm12 8.755-3.724-2.235L15 7.583V12a1 1 0 0 0 1-1V4.217l-7 4.2-7-4.2V12a1 1 0 0 0 1 1h12z"/>
                    </svg>
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
                    placeholder="name@university.edu"
                    style={{
                      width: '100%',
                      paddingLeft: '30px',
                      paddingRight: '10px',
                      paddingTop: '7px',
                      paddingBottom: '7px',
                      border: '1px solid #d1d5db',
                      borderRadius: '3px',
                      fontSize: '11px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#f9fafb'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1e3a8a';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
                      e.target.style.backgroundColor = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>
                {errors.email && (
                  <p style={{ marginTop: '6px', fontSize: '13px', color: '#dc2626' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#4b5563',
                    fontSize: '16px'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 1 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/>
                    </svg>
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
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      paddingLeft: '30px',
                      paddingRight: '30px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '3px',
                      fontSize: '12px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#f0f4f8'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1e3a8a';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
                      e.target.style.backgroundColor = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
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
                      color: '#4b5563',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5a7 7 0 0 0-2.79-.588l.77.771A6.6 6.6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457L13.359 11.238zm3.01-3.01a.5.5 0 0 0-.708-.708L15.061 7.32l-1.735-1.735a.5.5 0 0 0-.708.708l1.735 1.735 1.735 1.735a.5.5 0 0 0 .708-.708zM1.641 4.762C.93 6.28 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588l-.77-.771A6.6 6.6 0 0 1 8 12.5c-2.12 0-3.879-1.168-5.168-2.457L1.641 4.762zm-3.01 3.01a.5.5 0 0 0 .708.708L.939 8.68l1.735 1.735a.5.5 0 0 0 .708-.708L2.32 8.001l-1.735-1.735a.5.5 0 0 0-.708.708z"/>
                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm-1.293-7.171a.5.5 0 0 0-.708.708L10.32 8l-1.735 1.735a.5.5 0 0 0 .708.708l1.735-1.735 1.735 1.735a.5.5 0 0 0 .708-.708L11.68 8l1.735-1.735a.5.5 0 0 0-.708-.708z"/>
                        <path d="M1.641 4.762C.93 6.28 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588l-.77-.771A6.6 6.6 0 0 1 8 12.5c-2.12 0-3.879-1.168-5.168-2.457L1.641 4.762zm-3.01 3.01a.5.5 0 0 0 .708.708L.939 8.68l1.735 1.735a.5.5 0 0 0 .708-.708L2.32 8.001l-1.735-1.735a.5.5 0 0 0-.708.708z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5a7 7 0 0 0-2.79-.588l.77.771A6.6 6.6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457L13.359 11.238zm3.01-3.01a.5.5 0 0 0-.708-.708L15.061 7.32l-1.735-1.735a.5.5 0 0 0-.708.708l1.735 1.735 1.735 1.735a.5.5 0 0 0 .708-.708zM1.641 4.762C.93 6.28 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588l-.77-.771A6.6 6.6 0 0 1 8 12.5c-2.12 0-3.879-1.168-5.168-2.457L1.641 4.762zm-3.01 3.01a.5.5 0 0 0 .708.708L.939 8.68l1.735 1.735a.5.5 0 0 0 .708-.708L2.32 8.001l-1.735-1.735a.5.5 0 0 0-.708.708z"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ marginTop: '6px', fontSize: '13px', color: '#dc2626' }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#4b5563' }}>
                  <input
                    type="checkbox"
                    style={{ marginRight: '5px', accentColor: '#1e3a8a', width: '12px', height: '12px' }}
                  />
                  Remember me
                </label>
                <a href="#" style={{ fontSize: '10px', color: '#1e3a8a', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s ease' }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '7px',
                  background: isLoading ? '#9ca3af' : '#1e3a8a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '12px',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.background = '#1e40af';
                    e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.background = '#1e3a8a';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }
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

            </form>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        width: '100%',
        background: '#1e3a8a',
        color: 'white',
        padding: '8px 0', /* Increased padding */
        fontSize: '11px', /* Larger font */
        textAlign: 'center',
        borderTop: '2px solid #ff6b35', /* Thicker border */
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 25px' }}> {/* Increased horizontal padding */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0 }}>Contact: support@university.edu • +91 98765 43210</p>
            </div>
            <div>
              <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} All Rights Reserved.</p> {/* Updated footer text */}
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;