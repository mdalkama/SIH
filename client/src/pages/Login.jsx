import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');
  const [lastStatus, setLastStatus] = useState(null);
  const [lastBackendMessage, setLastBackendMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/${userType}/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const ct = res.headers.get('content-type') || '';
      const data = ct.includes('application/json') ? await res.json() : null;
      setLastStatus(res.status);
      setLastBackendMessage(data?.message || (res.ok ? 'OK' : 'Not authorized'));
      if (res.ok && userType === 'student') navigate('/student');
      // for staff we don't auto-redirect here because we need role
    } catch (e) {
      setLastStatus(null);
      setLastBackendMessage('Network error');
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setLastStatus(null);
    setLastBackendMessage('');

    try {
      const result = await login(data.email, data.password, userType);

      if (userType === 'student') {
        navigate('/student');
      } else if (userType === 'staff') {
        const role = result.staff?.role;
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
            navigate('/staff/collegeFaculty');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.status === 400) {
        errorMessage = error.data?.message || error.message || 'Invalid email or password.';
      } else if (error.status === 403) {
        errorMessage = 'Account is not active. Please contact administrator.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message && /network/i.test(error.message)) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (typeof error.message === 'string') {
        errorMessage = error.message;
      }
      setLastStatus(error.status ?? null);
      setLastBackendMessage(error.data?.message || error.message || '');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', background: '#f5f7fb', display: 'flex', flexDirection: 'column' }}>
      {/* Top dark header bar */}
      <div style={{ background: '#0b2a44', padding: '14px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://numberonejobsite.in/wp-content/uploads/2022/02/320px-Emblem_Rajasthan.png" alt="Logo" style={{ width: '26px', filter: 'grayscale(100%)' }} />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>Department of Technical Education, Rajasthan</div>
              <div style={{ color: '#b9c6d3', fontSize: '12px' }}>ERP Management System</div>
            </div>
          </div>
          <button style={{ background: '#0b2540', color: 'white', border: '1px solid #2b4360', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }}>Official Portal</button>
        </div>
      </div>

      {/* Center card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '780px', background: 'white', borderRadius: '14px', boxShadow: '0 10px 30px rgba(16,24,40,0.08)', border: '1px solid #e5e7eb' }}>
          {/* Card header */}
          <div style={{ background: '#e9f1fb', borderTopLeftRadius: '14px', borderTopRightRadius: '14px', padding: '18px 24px', borderBottom: '1px solid #d7e3f8' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0b2540', fontSize: '20px' }}>Department of Technical Education,</div>
                <div style={{ fontWeight: 700, color: '#0b2540', fontSize: '20px' }}>Rajasthan</div>
                <div style={{ color: '#3b4a5a', fontSize: '12px', marginTop: '2px' }}>ERP Management System • Secure Login</div>
              </div>
              <span style={{ background: '#1557a5', color: 'white', fontSize: '12px', padding: '6px 10px', borderRadius: '6px' }}>Government Portal</span>
            </div>
          </div>

          <div style={{ padding: '18px 24px 24px' }}>
            <div style={{ background: '#eef2f6', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 12px', color: '#334155', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#1f3b63' }}>i</span>
              <span>Use institutional credentials to sign in. Do not share your password.</span>
            </div>

            {/* Role tabs */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setUserType('student')} style={{ flex: 1, border: '1px solid ' + (userType === 'student' ? '#1f4ea8' : '#e5e7eb'), background: userType === 'student' ? '#123b74' : 'white', color: userType === 'student' ? 'white' : '#344054', borderRadius: '8px', padding: '10px 0', fontWeight: 600, cursor: 'pointer' }}>Student</button>
              <button type="button" onClick={() => setUserType('staff')} style={{ flex: 1, border: '1px solid ' + (userType === 'staff' ? '#1f4ea8' : '#e5e7eb'), background: userType === 'staff' ? '#123b74' : 'white', color: userType === 'staff' ? 'white' : '#344054', borderRadius: '8px', padding: '10px 0', fontWeight: 600, cursor: 'pointer' }}>Staff</button>
            </div>

            {error && (
              <div style={{ marginTop: '14px', padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '12px' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '14px' }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#475467', marginBottom: '6px', fontWeight: 600 }}>Email or Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" opacity="0"/><path d="m4 8 8 5 8-5"/><rect width="16" height="12" x="4" y="6" rx="2"/></svg>
                  </span>
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                    type="email"
                    placeholder="name@example.com"
                    style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #d0d5dd', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                    onFocus={(e) => { e.target.style.borderColor = '#1f4ea8'; e.target.style.boxShadow = '0 0 0 3px rgba(31,78,168,0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#d0d5dd'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                {errors.email && (<div style={{ color: '#b91c1c', fontSize: '12px', marginTop: '6px' }}>{errors.email.message}</div>)}
              </div>

              {/* Password */}
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#475467', marginBottom: '6px', fontWeight: 600 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#667085' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '12px 40px 12px 40px', border: '1px solid #d0d5dd', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                    onFocus={(e) => { e.target.style.borderColor = '#1f4ea8'; e.target.style.boxShadow = '0 0 0 3px rgba(31,78,168,0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#d0d5dd'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#667085', cursor: 'pointer' }}>
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l20 20"/><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A9.94 9.94 0 0 1 12 5c7 0 10 7 10 7a13.07 13.07 0 0 1-5.06 5.95"/><path d="M6.61 6.61A13.07 13.07 0 0 0 2 12s3 7 10 7a9.94 9.94 0 0 0 3.27-.55"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                {errors.password && (<div style={{ color: '#b91c1c', fontSize: '12px', marginTop: '6px' }}>{errors.password.message}</div>)}
              </div>

              {/* Helpers row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <a href="#" style={{ color: '#1557a5', fontSize: '12px', textDecoration: 'underline' }}>Forgot password?</a>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* <span style={{ fontSize: '12px', background: '#eef2f6', border: '1px solid #d0d5dd', padding: '6px 10px', borderRadius: '8px', color: '#344054' }}>UGC</span>
                  <span style={{ fontSize: '12px', background: '#eef2f6', border: '1px solid #d0d5dd', padding: '6px 10px', borderRadius: '8px', color: '#344054' }}>AICTE</span> */}
                </div>
              </div>

              <button type="submit" disabled={isLoading} style={{ marginTop: '16px', width: '100%', background: '#0f3f79', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                {isLoading ? 'Signing in…' : 'Login'}
              </button>

              {/* <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <button type="button" onClick={checkSession} style={{ background: '#eef2f6', border: '1px solid #d0d5dd', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', color: '#0b2540' }}>Check session</button>
              </div> */}
            </form>

            {/* Dev Debug Panel (visible only when there is an error or status) */}
            {(lastStatus || lastBackendMessage) && (
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#334155' }}>
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '8px 10px' }}>
                  {lastStatus ? <div><strong>Status:</strong> {lastStatus}</div> : null}
                  {lastBackendMessage ? (<div><strong>Backend:</strong> {lastBackendMessage}</div>) : null}
                  <div><strong>User Type:</strong> {userType}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom dark footer bar */}
      <div style={{ background: '#0b2a44', padding: '10px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#b9c6d3', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '16px', height: '16px' }}>🌐</span>
            <span>Department of Technical Education, Rajasthan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '16px', height: '16px' }}>✉️</span>
            <span>support@dte.rajasthan.gov.in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;