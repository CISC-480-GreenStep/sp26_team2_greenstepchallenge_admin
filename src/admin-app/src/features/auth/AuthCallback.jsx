import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { supabase } from '../../data/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically picks up the tokens from the URL hash/query params
    // and fires onAuthStateChange in AuthContext. We just need to wait a moment
    // for the session to be established, then redirect.
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth callback error:', error.message);
        navigate('/login');
      } else {
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
      <CircularProgress />
      <Typography color="text.secondary">Signing you in...</Typography>
    </Box>
  );
}
