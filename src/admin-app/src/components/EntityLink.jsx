import { useNavigate } from "react-router-dom";

import Link from "@mui/material/Link";

export default function EntityLink({ type, id, children }) {
  const navigate = useNavigate();
  if (!id) return children || "—";
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
