import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const API_BASE_URL = '/api/v1';

  const http = async (method, path, body) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : null;
    if (!res.ok) {
      const message = data?.message || `Request failed: ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  };

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const student = await http('GET', '/student/me');
      setUser({ ...student, userType: 'student', role: 'student' });
      setIsAuthenticated(true);
      return;
    } catch {}
    try {
      const staffResp = await http('GET', '/staff/me');
      const staff = staffResp?.staff || staffResp;
      setUser({ ...staff, userType: 'staff', role: staff?.role });
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await checkAuthStatus(); })();
  }, []);

  const login = async (email, password, userType) => {
    setLoading(true);
    try {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const payload = { email: normalizedEmail, password: String(password || '') };

      if (userType === 'student') {
        await http('POST', '/student/login', payload);
        const me = await http('GET', '/student/me');
        setUser({ ...me, userType: 'student', role: 'student' });
        setIsAuthenticated(true);
        return { student: { ...me, role: 'student' } };
      }

      if (userType === 'staff') {
        const loginRes = await http('POST', '/staff/login', payload);
        const meRes = await http('GET', '/staff/me');
        const staff = meRes?.staff || meRes;
        const role = staff?.role || loginRes?.staff?.role;
        const merged = { ...staff, role };
        setUser({ ...merged, userType: 'staff' });
        setIsAuthenticated(true);
        return { staff: merged };
      }

      throw new Error('Unknown user type');
    } catch (e) {
      setUser(null);
      setIsAuthenticated(false);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user?.userType === 'student') {
        await http('POST', '/student/logout');
      } else if (user?.userType === 'staff') {
        await http('POST', '/staff/logout');
      }
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthProvider;
