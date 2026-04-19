/**
 * @file CatalogPresets.jsx
 * @summary "Quick Layouts" section of the WidgetCatalog drawer.
 *
 * Renders one chip per named layout preset. Clicking a chip applies
 * that preset (visibility + arrangement) via the parent-supplied
 * `onApplyPreset(presetId)` callback.
 */

import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";

import { LAYOUT_PRESETS } from "../../config";

export default function CatalogPresets({ onApplyPreset }) {
  return (
    <Box sx={{ px: 2, pt: 2, pb: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Quick Layouts
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Apply a preset layout — you can customize it further after applying.
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {LAYOUT_PRESETS.map((preset) => (
          <Tooltip key={preset.id} title={preset.description} arrow>
            <Chip
              label={preset.name}
              onClick={() => onApplyPreset(preset.id)}
              variant="outlined"
              color="primary"
              clickable
              sx={{ mb: 0.5 }}
            />
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}
