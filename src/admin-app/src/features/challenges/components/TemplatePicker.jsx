/**
 * @file TemplatePicker.jsx
 * @summary TemplatePicker -- "Quick Start: Select a Template" panel shown only on
 * the create flow. Picking a template pre-fills the challenge fields and
 * stages a list of global actions to attach on submit.
 *
 * Pure presentational; the parent owns the form/template state.
 */

import {
  MenuItem,
  Paper,
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
 * @param {Array<{ name: string, category: string, points: number }>} props.templateActions
 */
export default function TemplatePicker({ templates, selectedTemplateId, onSelect, templateActions }) {
  if (!templates.length) return null;

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2, mb: 1, bgcolor: "#f9f9f9" }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Quick Start: Select a Template
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          value={selectedTemplateId}
          onChange={onSelect}
          label="Choose a Template"
        >
          <MenuItem value="">None</MenuItem>
          {templates.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name} ({p.categories?.join(', ') || 'No Category'})
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {templateActions.length > 0 && <TemplateActionsPreview actions={templateActions} />}
    </>
  );
}

/**
 * Preview table of the actions the template will link.
 */
function TemplateActionsPreview({ actions }) {
  return (
    <>
      <Typography variant="subtitle2" fontWeight={600} mt={2} mb={1}>
        Actions from Template ({actions.length})
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
