/**
 * @file AuthContext.jsx
 * @summary Provides the application's auth state and actions to the React tree.
 *
 * Wraps the app in `<AuthProvider>` to:
 *   - Restore Supabase sessions on mount (and a "dev login" fallback from localStorage).
 *   - Subscribe to Supabase auth events so login/logout in another tab still propagates.
 *   - Expose `login`, `devLogin`, `logout`, and `hasRole` to consumers.
 *
 * The hook (`useAuth`) and the context object live in sibling files so this
 * module exports only a component — required for Vite React Fast Refresh.
 */

import { useState, useEffect, useMemo, useCallback } from "react";

import { AuthContext } from "./authContextValue";
import { ROLES } from "../../data/api";
import { supabase } from "../../data/supabase";

/** localStorage key holding the dev-login email when Supabase Auth is bypassed. */
const DEV_LOGIN_STORAGE_KEY = "gsc_dev_user";

/** Role hierarchy ordered from least to most privileged. */
const ROLE_HIERARCHY = [ROLES.GENERAL_USER, ROLES.ADMIN, ROLES.SUPER_ADMIN];

/**
 * Look up the application user row by email. Returns null when the email is
 * not registered in the `users` table — callers should treat that as
 * "authenticated but unauthorized to use the admin app".
 */
async function loadAppUser(email) {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single();
  if (error || !data) return null;
  return data;
}

/**
 * Top-level provider that wires Supabase auth events into React state.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session restore: prefer a real Supabase session, fall back to
    // the dev-login email if one is stashed in localStorage.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user?.email) {
        const appUser = await loadAppUser(session.user.email);
        setUser(appUser);
      } else {
        const devEmail = localStorage.getItem(DEV_LOGIN_STORAGE_KEY);
        if (devEmail) {
          const appUser = await loadAppUser(devEmail);
          if (appUser) setUser(appUser);
        }
      }
      setLoading(false);
    });

    // Keep React state in sync with Supabase auth state changes from any
    // source (other tabs, token refresh, programmatic sign-out).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email) {
        const appUser = await loadAppUser(session.user.email);
        setUser(appUser);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /** Send a magic-link email to start a real Supabase Auth session. */
  const login = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  // Dev-only escape hatch: bypass Supabase Auth entirely and load the user
  // straight from the database. Persist the chosen email so a page refresh
  // restores the same identity.
  const devLogin = useCallback(async (email) => {
    const appUser = await loadAppUser(email);
    if (!appUser) return { success: false, error: "User not found in database" };
    setUser(appUser);
    localStorage.setItem(DEV_LOGIN_STORAGE_KEY, email);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem(DEV_LOGIN_STORAGE_KEY);
  }, []);

  // Closed over `user` only — recreating on every user change is intentional
  // so role checks reflect the latest role without stale closures.
  const hasRole = useCallback(
    (requiredRole) => {
      if (!user) return false;
      return ROLE_HIERARCHY.indexOf(user.role) >= ROLE_HIERARCHY.indexOf(requiredRole);
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, login, devLogin, logout, hasRole }),
    [user, loading, login, devLogin, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
