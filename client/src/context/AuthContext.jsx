import { createContext, useContext, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const SESSION_KEY = 'hms_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      const data = await authAPI.login(email, password);
      // data = { success, message, data: { token, user } }
      const { token, user: userData } = data.data;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...userData, token }));
      setUser(userData);
      return userData;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const getToken = () => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s)?.token || null : null;
    } catch { return null; }
  };

  return (
    <AuthContext.Provider value={{ user, authError, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
