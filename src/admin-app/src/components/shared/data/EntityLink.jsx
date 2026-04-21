/**
 * @file EntityLink.jsx
 * @summary Inline link button that navigates to a top-level entity detail page.
 *
 * Renders a text link that, on click, programmatically navigates to
 * `/{type}/{id}` (e.g. `/users/42`). Uses `e.stopPropagation()` so it can
 * live inside a clickable row without triggering the row handler.
 *
 * If `id` is falsy, renders the children (or an em-dash) as plain text.
 */

import { useNavigate } from "react-router-dom";

import Link from "@mui/material/Link";

/**
 * @param {object} props
 * @param {"users" | "challenges" | "groups" | "presets"} props.type - Route segment to navigate to.
 * @param {number | string | null | undefined} props.id
 * @param {React.ReactNode} props.children - Visible link text (usually the entity name).
 */
export default function EntityLink({ type, id, children }) {
  const navigate = useNavigate();
  if (!id) return children || "\u2014";
  return (
    <Link
      component="button"
      variant="body2"
      underline="hover"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/${type}/${id}`);
      }}
      sx={{ textAlign: "left", verticalAlign: "inherit" }}
    >
      {children}
    </Link>
  );
}
