import { Navigate, useLocation } from "react-router-dom";

import { Box, CircularProgress } from "@mui/material";

import { useAuth } from "./AuthContext";

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
