import { createContext, useContext, useState, useMemo } from 'react';
import { ROLES } from '../../data/api';

const AuthContext = createContext(null);

const MOCK_ACCOUNTS = [
  { email: 'kristin.mroz@mpca.mn.gov', password: 'admin', id: 1, name: 'Kristin Mroz-Risse', role: ROLES.SUPER_ADMIN },
  { email: 'sarah.johnson@mpca.mn.gov', password: 'user', id: 5, name: 'Sarah Johnson', role: ROLES.GENERAL_USER },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gsc_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = (email, password) => {
    const account = MOCK_ACCOUNTS.find(
      (a) => a.email === email && a.password === password,
    );
    if (!account) return { success: false, error: 'Invalid email or password' };
    const { password: _pw, ...safeUser } = account;
    setUser(safeUser);
    localStorage.setItem('gsc_auth_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gsc_auth_user');
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    const hierarchy = [ROLES.GENERAL_USER, ROLES.ADMIN, ROLES.SUPER_ADMIN];
    return hierarchy.indexOf(user.role) >= hierarchy.indexOf(requiredRole);
  };

  const value = useMemo(
    () => ({ user, login, logout, hasRole }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
