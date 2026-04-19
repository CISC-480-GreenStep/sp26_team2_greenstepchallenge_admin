/**
 * @file DashboardWidget.jsx
 * @summary Card chrome (title bar + drag handle + remove button) wrapped
 * around every widget rendered into the dashboard grid.
 */

import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Card, Box, Typography, IconButton, Tooltip } from "@mui/material";

export default function DashboardWidget({ title, isEditing, onRemove, children }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "box-shadow 0.2s, outline-color 0.2s",
        ...(isEditing
          ? {
              outline: "2px dashed",
              outlineColor: "primary.light",
              outlineOffset: -2,
              "&:hover": { boxShadow: 6 },
            }
          : {}),
      }}
    >
      <Box
        className="drag-handle"
        sx={{
          display: "flex",
          alignItems: "center",
          px: { xs: 1, sm: 1.5 },
          py: 0.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          minHeight: { xs: 32, sm: 36 },
          bgcolor: isEditing ? "action.hover" : "transparent",
          transition: "background-color 0.15s",
          ...(isEditing ? { cursor: "grab", "&:active": { cursor: "grabbing" } } : {}),
        }}
      >
        {isEditing && <DragIndicatorIcon sx={{ mr: 0.5, color: "grey.500", fontSize: 16 }} />}
        <Typography
          variant="subtitle2"
          fontWeight={600}
          flex={1}
          noWrap
          sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
        >
          {title}
        </Typography>
        {isEditing && (
          <Tooltip title="Remove widget" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              sx={{ ml: 0.5, opacity: 0.6, "&:hover": { opacity: 1 }, p: 0.25 }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", p: { xs: 0.75, sm: 1, md: 1.5 } }}>
        {children}
      </Box>
    </Card>
  );
}
