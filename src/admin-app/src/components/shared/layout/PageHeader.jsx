/**
 * @file PageHeader.jsx
 * @summary Standard "Back button + page title" row used by every detail
 * and form page. Replaces eight near-identical copies of the same JSX
 * scattered across features/.
 */

import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Typography } from "@mui/material";

/**
 * @param {object} props
 * @param {string} [props.title] - Optional title rendered as h5 below the back button.
 * @param {boolean} [props.back=true] - Show the Back button.
 * @param {() => void} [props.onBack] - Override default back handler (defaults to navigate(-1)).
 * @param {React.ReactNode} [props.children] - Optional override slot for custom title row content.
 */
export default function PageHeader({ title, back = true, onBack, children }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <>
      {back && (
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back
        </Button>
      )}
      {children
        ? children
        : title && (
            <Typography
              variant="h5"
              fontWeight={700}
              mb={3}
              sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              {title}
            </Typography>
          )}
    </>
  );
}
