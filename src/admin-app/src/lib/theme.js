/**
 * @file theme.js
 * @summary Global MUI v7 theme — dark palette, typography, and component defaults.
 *
 * The whole admin app is wired to one MUI theme (mounted in main.jsx via
 * <ThemeProvider>). Centralizing it here keeps main.jsx as a thin entry
 * point and matches the location ARCHITECTURE.md §4 already designates.
 *
 * Hex values below are the team's first-pass dark palette for issue #20.
 * Treat them as the baseline; final design call is still a TEAM DECISION
 * tracked on the issue (see docs/guides/theme-design-system.md §6A).
 *
 * Note: chart palettes intentionally live in lib/constants.js, not here.
 * Recharts series + a few inline-styled previews read those directly,
 * and pulling them through useTheme() at every callsite would add churn
 * for no real win. See lib/constants.js header for the longer reasoning.
 */

import { createTheme } from "@mui/material";

// Brand greens kept intentionally close to the v0.7.x light-theme primary
// so existing collateral (logo, marketing screenshots) still reads as
// GreenStep. The dark-on-dark-green contrast is poor, so the palette
// shifts to a lighter, higher-luminance green for surfaces — the original
// #2E7D32 stays available via primary.dark for buttons that need depth.
const PRIMARY_MAIN = "#66BB6A";
const PRIMARY_DARK = "#2E7D32";
const SECONDARY_MAIN = "#4DD0E1";
const SECONDARY_DARK = "#00838F";

// Surfaces tuned so text.primary (#E8EAED) hits WCAG AA on background.paper.
const BG_DEFAULT = "#0F1419";
const BG_PAPER = "#1A1F26";
const DIVIDER = "rgba(255, 255, 255, 0.12)";

const TEXT_PRIMARY = "#E8EAED";
const TEXT_SECONDARY = "#9AA0A6";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: PRIMARY_MAIN, dark: PRIMARY_DARK, contrastText: "#0F1419" },
    secondary: { main: SECONDARY_MAIN, dark: SECONDARY_DARK, contrastText: "#0F1419" },
    background: { default: BG_DEFAULT, paper: BG_PAPER },
    text: { primary: TEXT_PRIMARY, secondary: TEXT_SECONDARY },
    divider: DIVIDER,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    // MUI dark mode applies a subtle white overlay to <Paper> based on
    // elevation. That fights our deliberate two-tier surface scale
    // (background.default / background.paper), so disable it globally.
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiAppBar: {
      defaultProps: { color: "default", elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: BG_PAPER,
          borderBottom: `1px solid ${DIVIDER}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: BG_PAPER, borderRight: `1px solid ${DIVIDER}` },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: DIVIDER },
      },
    },
  },
});

export default theme;
