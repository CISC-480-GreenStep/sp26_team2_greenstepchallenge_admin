/**
 * @file TemplatePicker.jsx
 * @summary TemplatePicker -- "Quick Start" panel shown only on the create flow.
 * Offers two data sources: a pre-built Template or a previously Archived
 * Challenge. Picking either pre-fills the challenge fields and stages
 * a list of actions to attach on submit.
 *
 * Pure presentational; the parent owns the form/template state.
 */

import {
  Divider,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

/**
 * @param {object}   props
 * @param {Array<{ id: string, name: string, categories: string[], actions?: Array<object> }>} props.templates
 * @param {string}   props.selectedTemplateId
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onSelect
 * @param {Array<object>} [props.archivedChallenges] Archived challenges available for cloning.
 * @param {string}   [props.selectedCloneId]
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} [props.onCloneSelect]
 * @param {Array<{ name: string, category: string, points: number }>} props.templateActions
 */
export default function TemplatePicker({
  templates,
  selectedTemplateId,
  onSelect,
  archivedChallenges = [],
  selectedCloneId = "",
  onCloneSelect,
  templateActions,
}) {
  const hasTemplates = templates.length > 0;
  const hasArchived = archivedChallenges.length > 0;
  if (!hasTemplates && !hasArchived) return null;

  const previewLabel = selectedCloneId
    ? "Actions from Past Challenge"
    : "Actions from Template";

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2, mb: 1, bgcolor: "action.hover" }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Quick Start
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          {hasTemplates && (
            <TextField
              select
              fullWidth
              size="small"
              value={selectedTemplateId}
              onChange={onSelect}
              label="From Template"
            >
              <MenuItem value="">None</MenuItem>
              {templates.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} ({p.categories?.join(", ") || "No Category"})
                </MenuItem>
              ))}
            </TextField>
          )}

          {hasArchived && (
            <TextField
              select
              fullWidth
              size="small"
              value={selectedCloneId}
              onChange={onCloneSelect}
              label="Clone from Past Challenge"
            >
              <MenuItem value="">None</MenuItem>
              {archivedChallenges.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} ({c.categories?.join(", ") || "No Category"})
                </MenuItem>
              ))}
            </TextField>
          )}
        </Stack>
      </Paper>

      {templateActions.length > 0 && (
        <TemplateActionsPreview actions={templateActions} label={previewLabel} />
      )}
    </>
  );
}

/**
 * Preview table of the actions that will be linked.
 */
function TemplateActionsPreview({ actions, label = "Actions from Template" }) {
  return (
    <>
      <Typography variant="subtitle2" fontWeight={600} mt={2} mb={1}>
        {label} ({actions.length})
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        These actions will be linked to the challenge automatically when you submit.
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.map((a, i) => (
              <TableRow key={i}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.category}</TableCell>
                <TableCell align="right">{a.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
