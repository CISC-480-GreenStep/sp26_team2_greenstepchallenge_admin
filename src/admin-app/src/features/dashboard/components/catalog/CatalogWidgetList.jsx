/**
 * @file CatalogWidgetList.jsx
 * @summary Search box + category-grouped list of every widget the
 * dashboard supports, with a per-row visibility toggle.
 *
 * Each list item highlights when the widget is currently on the
 * dashboard. Clicking the row OR the switch fires `onToggle(widgetId)`;
 * the switch's onClick is stopped from propagating so the two events
 * don't double-fire.
 */

import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
  alpha,
} from "@mui/material";

import { WIDGETS, WIDGET_CATEGORIES } from "../../config";

export default function CatalogWidgetList({ visible, onToggle }) {
  const [search, setSearch] = useState("");

  const filtered = WIDGETS.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase()),
  );

  // Iterate categories in their declared display order rather than
  // hash-map insertion order so the drawer is stable across renders.
  const categories = Object.entries(WIDGET_CATEGORIES).sort(([, a], [, b]) => a.order - b.order);

  return (
    <>
      <Box sx={{ px: 2, py: 1.5 }}>
        <TextField
          placeholder="Search widgets..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", px: 2, pb: 2 }}>
        {categories.map(([catId, catInfo]) => {
          const catWidgets = filtered.filter((w) => w.category === catId);
          if (catWidgets.length === 0) return null;

          const activeCount = catWidgets.filter((w) => visible.includes(w.id)).length;

          return (
            <Box key={catId} sx={{ mb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="overline" color="text.secondary" flex={1}>
                  {catInfo.label}
                </Typography>
                <Chip
                  label={`${activeCount}/${catWidgets.length}`}
                  size="small"
                  color={activeCount > 0 ? "primary" : "default"}
                  variant={activeCount > 0 ? "filled" : "outlined"}
                  sx={{ fontSize: 11, height: 22 }}
                />
              </Box>

              <Stack spacing={0.5}>
                {catWidgets.map((widget) => {
                  const isActive = visible.includes(widget.id);
                  return (
                    <Box
                      key={widget.id}
                      onClick={() => onToggle(widget.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: isActive ? "primary.light" : "divider",
                        bgcolor: isActive
                          ? (theme) => alpha(theme.palette.primary.main, 0.04)
                          : "transparent",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" fontWeight={500}>
                          {widget.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {widget.description}
                        </Typography>
                      </Box>
                      <Switch
                        size="small"
                        checked={isActive}
                        onChange={() => onToggle(widget.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          );
        })}

        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
            No widgets match your search
          </Typography>
        )}
      </Box>
    </>
  );
}
