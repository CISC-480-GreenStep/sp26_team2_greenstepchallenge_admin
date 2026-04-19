import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import App from "./App";
import { AuthProvider } from "./features/auth/AuthContext";

const theme = createTheme({
  palette: {
    primary: { main: "#2E7D32" },
    secondary: { main: "#00838F" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
