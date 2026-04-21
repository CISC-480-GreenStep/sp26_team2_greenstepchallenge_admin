import { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../../data/supabase';
import { ROLES } from '../../data/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track the auth email separately so we can load the DB user outside
  // the onAuthStateChange callback (avoids deadlocks during token refresh)
  const [authEmail, setAuthEmail] = useState(null);
  const initialLoad = useRef(true);

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

  // Load app user whenever authEmail changes
  useEffect(() => {
    if (authEmail === null && !initialLoad.current) {
      // Auth email was cleared (sign out)
      setUser(null);
      return;
    }
    if (!authEmail) return;

    let cancelled = false;
    loadAppUser(authEmail).then((appUser) => {
      if (!cancelled) setUser(appUser);
    });
    return () => { cancelled = true; };
  }, [authEmail]);

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user?.email) {
        const appUser = await loadAppUser(session.user.email);
        setUser(appUser);
        setAuthEmail(session.user.email);
      } else {
        // Restore dev login session if present
        const devEmail = localStorage.getItem('gsc_dev_user');
        if (devEmail) {
          const appUser = await loadAppUser(devEmail);
          if (appUser) setUser(appUser);
        }
      }
      initialLoad.current = false;
      setLoading(false);
    });

    // Listen for auth changes — keep this callback sync to avoid
    // deadlocks with the Supabase auth state machine during token refresh.
    // The DB lookup happens in the authEmail useEffect above.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email) {
          setAuthEmail(session.user.email);
        } else if (event === 'SIGNED_OUT') {
          setAuthEmail(null);
        }
        // TOKEN_REFRESHED: no action needed, session is still valid
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
