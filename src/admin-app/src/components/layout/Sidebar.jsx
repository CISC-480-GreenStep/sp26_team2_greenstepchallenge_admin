/**
 * @file Sidebar.jsx
 * @summary Primary nav drawer.
 *
 * Renders a permanent drawer on `md+` screens and a temporary drawer on
 * mobile (toggled from `<TopBar>`). Highlights the current route based
 * on `useLocation`.
 *
 * Exports `DRAWER_WIDTH` so `<AdminLayout>` can reserve the same gutter
 * width on the main content area.
 */

import { useLocation, useNavigate } from "react-router-dom";

import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleIcon from "@mui/icons-material/People";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { label: "Challenges", path: "/challenges", icon: <EventIcon /> },
  { label: "Groups", path: "/groups", icon: <GroupsIcon /> },
  { label: "Users", path: "/users", icon: <PeopleIcon /> },
  { label: "Reports", path: "/reports", icon: <AssessmentIcon /> },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isSelected = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const content = (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight={700} noWrap color="primary">
          GreenStep
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isSelected(item.path)}
            aria-current={isSelected(item.path) ? "page" : undefined}
            onClick={() => {
              navigate(item.path);
              onClose?.();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        aria-label="Main navigation"
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
        }}
      >
        {content}
      </Drawer>

      <Drawer
        variant="permanent"
        aria-label="Main navigation"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
        open
      >
        {content}
      </Drawer>
    </>
  );
}

export { DRAWER_WIDTH };
