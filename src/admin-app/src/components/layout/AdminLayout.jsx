/**
 * @file AdminLayout.jsx
 * @summary App shell for every authenticated route.
 *
 * Composes `<TopBar>`, `<Sidebar>`, and React Router's `<Outlet>` into
 * the standard "drawer + content" layout. Owns the mobile drawer's
 * open/closed state since it spans both the TopBar (toggle button) and
 * the Sidebar (drawer body).
 */

import { useState } from "react";

import { Outlet } from "react-router-dom";

import { Box, Toolbar } from "@mui/material";

import Sidebar, { DRAWER_WIDTH } from "./Sidebar";
import TopBar from "./TopBar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar onMenuToggle={() => setMobileOpen((o) => !o)} />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: { xs: "100vw", md: `calc(100vw - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
          bgcolor: "grey.50",
          overflowX: "auto",
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
