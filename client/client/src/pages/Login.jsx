const Login = () => {

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
                src="https://placehold.co/70x70" 
                alt="Department of Technical Education, Rajasthan Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'invert(100%)' }}
              />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: 'white', fontFamily: 'Arial, sans-serif' }}>Department of Technical Education, Rajasthan</h1> {/* Increased font size */}
              <p style={{ fontSize: '13px', margin: '2px 0 0 0' }}>ERP Management System</p> {/* Increased font size */}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button style={{
              background: '#0f2557',
              color: 'white',
              border: 'none',
              borderRadius: '3px', /* Slightly more rounded */
              padding: '3px 6px', /* Increased padding */
              fontSize: '12px', /* Larger font */
              marginLeft: '8px', /* Increased margin */
              cursor: 'pointer'
            }}>Official Portal</button>
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
              background: '#e6f1ff',
              padding: '8px 15px',
              marginBottom: '12px',
              color: '#1e3a8a',
              fontWeight: 'bold',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              Department of Technical Education, Rajasthan
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
                Select role
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
                    background: userType === 'student' ? '#1e3a8a' : 'transparent',
                    border: 'none',
                    color: userType === 'student' ? 'white' : '#374151',
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
                    background: userType === 'staff' ? '#1e3a8a' : 'transparent',
                    border: 'none',
                    color: userType === 'staff' ? 'white' : '#374151',
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
                  Email or Username
                </label>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="text"
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    paddingTop: '7px',
                    paddingBottom: '7px',
                    border: '1px solid #d1d5db',
                    borderRadius: '3px',
                    fontSize: '12px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#f9fafb'
                  }}
                />
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
                      paddingLeft: '10px',
                      paddingRight: '30px',
                      paddingTop: '7px',
                      paddingBottom: '7px',
                      border: '1px solid #d1d5db',
                      borderRadius: '3px',
                      fontSize: '12px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#f9fafb'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      padding: '2px'
                    }}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.027 7.027 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A5.944 5.944 0 0 1 14.77 8c0 .346-.034.684-.101 1.016l.77.771A7.027 7.027 0 0 0 16 8c0-.346.034-.684.101-1.016l-.77-.771zM8 12.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                        <path d="M3.654 4.346l-.77-.771A7.027 7.027 0 0 0 0 8c0 .346.034.684.101 1.016l.77-.771A5.944 5.944 0 0 1 0 8c0-.346.034-.684.101-1.016l.77.771zm2.127 2.127l-.77-.771A5.944 5.944 0 0 0 4 8c0 .346.034.684.101 1.016l.77-.771zm8.218 8.218l-1.735-1.735a.5.5 0 0 0-.708.708l1.735 1.735a.5.5 0 0 0 .708-.708zm-9.9-9.9l-1.735-1.735a.5.5 0 0 0-.708.708l1.735 1.735a.5.5 0 0 0 .708-.708z"/>
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
                <a href="#" style={{ fontSize: '12px', color: '#1e3a8a', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s ease' }}>
                  Forgot password?
                </a>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button style={{
                    background: '#1e3a8a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '3px 6px',
                    fontSize: '12px',
                    marginLeft: '8px',
                    cursor: 'pointer'
                  }}>UGC</button>
                  <button style={{
                    background: '#1e3a8a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '3px 6px',
                    fontSize: '12px',
                    marginLeft: '8px',
                    cursor: 'pointer'
                  }}>AICTE</button>
                </div>
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
                  `Login`
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
              <p style={{ margin: 0 }}>Department of Technical Education, Rajasthan</p>
            </div>
            <div>
              <p style={{ margin: 0 }}>support@dte.rajasthan.gov.in</p>
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