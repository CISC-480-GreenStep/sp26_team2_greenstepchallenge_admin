/**
 * @file useAuth.js
 * @summary Hook to read the authenticated user and auth actions.
 *
 * Lives in its own file so React Fast Refresh can hot-reload
 * `AuthContext.jsx` (which exports only the provider component) without
 * tripping `react-refresh/only-export-components`.
 */

import { useContext } from "react";

import { AuthContext } from "./authContextValue";

/**
 * Returns the current auth context value.
 *
 * @returns {{
 *   user: object | null,
 *   loading: boolean,
 *   login: (email: string) => Promise<{ success: boolean, error?: string }>,
 *   devLogin: (email: string) => Promise<{ success: boolean, error?: string }>,
 *   logout: () => Promise<void>,
 *   hasRole: (requiredRole: string) => boolean,
 * }}
 * @throws if called outside of `<AuthProvider>`.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
