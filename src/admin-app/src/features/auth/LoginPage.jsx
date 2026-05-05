/**
 * @file LoginPage.jsx
 * @summary Sign-in screen with two-step OTP code auth + a dev-login fallback.
 *
 * Step 1: user enters their email and we send them a 8-digit code via Supabase
 * Auth. Step 2: user enters the code and we exchange it for a session.
 *
 * Code entry instead of magic-link clicks because institutional email scanners
 * (Microsoft Defender Safe Links, Mimecast, etc.) pre-fetch one-time link URLs
 * on arrival and consume the token before the user can click. A code in plain
 * text dodges that whole class of issue.
 *
 * The "Quick Login as Kristin" button bypasses Supabase Auth entirely and is
 * intended for local development and team demos only.
 */

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Box, Card, CardContent, TextField, Button, Typography, Alert, Stack } from "@mui/material";

import { useAuth } from "./useAuth";

export default function LoginPage() {
  const { login, verifyCode, devLogin } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // "email" | "code"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email);
    setSubmitting(false);
    if (result.success) {
      setStep("code");
    } else {
      setError(result.error);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await verifyCode(email, code.trim());
    setSubmitting(false);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  const handleStartOver = () => {
    setStep("email");
    setCode("");
    setError("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            GreenStep Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            {step === "email"
              ? "Sign in with your email"
              : `Enter the 8-digit code we sent to ${email}`}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendCode}>
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
                  {submitting ? "Sending..." : "Send Code"}
                </Button>
              </Stack>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode}>
              <Stack spacing={2}>
                <TextField
                  label="8-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                  inputMode="numeric"
                  slotProps={{
                    htmlInput: {
                      maxLength: 8,
                      pattern: "[0-9]*",
                      style: { letterSpacing: "0.4em", textAlign: "center", fontSize: "1.25rem" },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting || code.trim().length < 8}
                >
                  {submitting ? "Verifying..." : "Sign In"}
                </Button>
                <Button
                  variant="text"
                  size="small"
                  onClick={handleStartOver}
                  disabled={submitting}
                >
                  Use a different email
                </Button>
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  Didn't get the code? Check your spam/junk folder.
                </Typography>
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
