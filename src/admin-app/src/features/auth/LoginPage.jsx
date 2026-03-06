import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert, Stack,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useAuth } from './AuthContext';
import { resetDemoData } from '../../data/api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleReset = () => {
    resetDemoData();
    setResetMsg('Demo data has been reset to defaults.');
    setTimeout(() => setResetMsg(''), 3000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            GreenStep Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Sign in to the admin console
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {resetMsg && <Alert severity="success" sx={{ mb: 2 }}>{resetMsg}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" size="large" fullWidth>
                Sign In
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => {
                const result = login('kristin.mroz@mpca.mn.gov', 'admin');
                if (result.success) navigate('/');
              }}
            >
              Quick Login as Kristin (SuperAdmin)
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              size="small"
              color="warning"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
            >
              Reset Demo Data
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
