import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../../data/supabase';
import { ROLES } from '../../data/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Look up the app user row by email to get role, name, etc.
  async function loadAppUser(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error || !data) return null;
    return data;
  }

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user?.email) {
        const appUser = await loadAppUser(session.user.email);
        setUser(appUser);
      } else {
        // Restore dev login session if present
        const devEmail = localStorage.getItem('gsc_dev_user');
        if (devEmail) {
          const appUser = await loadAppUser(devEmail);
          if (appUser) setUser(appUser);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email) {
          const appUser = await loadAppUser(session.user.email);
          setUser(appUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  // Dev-only: bypass Supabase Auth and load user directly from DB
  const devLogin = async (email) => {
    const appUser = await loadAppUser(email);
    if (!appUser) return { success: false, error: 'User not found in database' };
    setUser(appUser);
    localStorage.setItem('gsc_dev_user', email);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('gsc_dev_user');
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    const hierarchy = [ROLES.GENERAL_USER, ROLES.ADMIN, ROLES.SUPER_ADMIN];
    return hierarchy.indexOf(user.role) >= hierarchy.indexOf(requiredRole);
  };

  const value = useMemo(
    () => ({ user, loading, login, devLogin, logout, hasRole }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
