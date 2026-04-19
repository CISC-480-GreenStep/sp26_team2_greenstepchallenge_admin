import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Box, Card, CardContent, TextField, Button, Typography, Alert, Stack } from "@mui/material";

import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { login, devLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email);
    setSubmitting(false);
    if (result.success) {
      setSent(true);
    } else {
      setError(result.error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            GreenStep Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Sign in with your email
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {sent ? (
            <Alert severity="success">
              Check your email for a magic link to sign in. You can close this tab.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Magic Link"}
                </Button>
              </Stack>
            </form>
          )}

          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={async () => {
                const result = await devLogin("kristin.mroz@mpca.mn.gov");
                if (result.success) navigate("/");
              }}
            >
              Quick Login as Kristin (SuperAdmin)
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
