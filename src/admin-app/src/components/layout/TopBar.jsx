import {
  AppBar, Toolbar, IconButton, Typography, Chip, Button, Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../features/auth/AuthContext';
import { DRAWER_WIDTH } from './Sidebar';

export default function TopBar({ onMenuToggle }) {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
      }}
      color="inherit"
      elevation={1}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Admin Console
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {user?.name}
          </Typography>
          <Chip label={user?.role} size="small" color="primary" variant="outlined" sx={{ display: { xs: 'none', sm: 'flex' } }} />
          <Button size="small" startIcon={<LogoutIcon />} onClick={logout} sx={{ minWidth: { xs: 'auto', sm: 64 } }}>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
