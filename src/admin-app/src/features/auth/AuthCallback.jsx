/**
 * @file AuthCallback.jsx
 * @summary Landing page for Supabase magic-link / OAuth redirects.
 *
 * Supabase parses tokens out of the URL hash/query automatically. We
 * just need to wait for `getSession()` to settle and then bounce the
 * user to the dashboard (success) or back to `/login` (failure).
 */

import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Box, CircularProgress, Typography } from "@mui/material";

import { supabase } from "../../data/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // supabase-js v2 defaults to PKCE flow, so the magic-link redirect lands
    // here with a `?code=...` query param that needs to be swapped for a
    // session before we navigate. getSession() alone won't do that exchange.
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Auth callback exchange error:", error.message);
          navigate("/login");
          return;
        }
      } else {
        // Implicit / hash-token flow: detectSessionInUrl picks tokens up
        // automatically; just verify a session ended up established.
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          if (error) console.error("Auth callback error:", error.message);
          navigate("/login");
          return;
        }
      }

      navigate("/");
    };

    handleCallback();
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">Signing you in...</Typography>
    </Box>
  );
}
