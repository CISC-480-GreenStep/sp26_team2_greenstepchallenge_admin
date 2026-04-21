/**
 * @file RequireAuth.jsx
 * @summary Route guard that gates children on auth + (optionally) role.
 *
 * - While the auth state is restoring, renders a centered spinner so we
 *   don't briefly redirect a logged-in user to /login on a hard refresh.
 * - Unauthenticated users are sent to /login, preserving the requested
 *   route in `location.state.from` for post-login redirect.
 * - Authenticated users without the required role are sent home (`/`).
 */

import { Navigate, useLocation } from "react-router-dom";

import { Box, CircularProgress } from "@mui/material";

import { useAuth } from "./useAuth";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.minRole] - Minimum role required (uses ROLES from data/api).
 */
export default function RequireAuth({ children, minRole }) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (minRole && !hasRole(minRole)) return <Navigate to="/" replace />;

  return children;
}
