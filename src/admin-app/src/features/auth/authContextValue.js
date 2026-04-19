/**
 * @file authContextValue.js
 * @summary Internal React context object shared by `AuthProvider` and `useAuth`.
 *
 * Kept in its own module so neither the provider component nor the hook
 * file has a mixed default-export, which keeps Vite's React Fast Refresh
 * happy (`react-refresh/only-export-components`).
 *
 * Consumers should NOT import this directly — use `useAuth` from
 * `./useAuth` to read the value, or wrap your tree with `AuthProvider`
 * from `./AuthContext`.
 */

import { createContext } from "react";

/**
 * Auth context shape:
 *   {
 *     user:     ?AppUser,           // row from `users` table, or null
 *     loading:  boolean,            // true while initial session restore is in flight
 *     login:    (email) => Promise<{ success, error? }>,
 *     devLogin: (email) => Promise<{ success, error? }>,
 *     logout:   () => Promise<void>,
 *     hasRole:  (requiredRole) => boolean,
 *   }
 */
export const AuthContext = createContext(null);
