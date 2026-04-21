/**
 * @file ComparisonSummaryTable.jsx
 * @summary Numeric summary table that mirrors the chart cards above it.
 *
 * Three rows per selected challenge:
 *   - Total Actions Completed (from `barData`)
 *   - Total Points Earned (from `barData`)
 *   - Top Performing Category (derived from `stackedCategoryData`)
 */

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const numberFormatter = new Intl.NumberFormat();

/** Pick the category with the highest count for a single challenge row. */
function topCategoryFor(dataRow) {
  if (!dataRow) return "N/A";
  let maxCat = "N/A";
  let maxVal = 0;
  Object.entries(dataRow).forEach(([key, val]) => {
    if (key === "challengeName") return;
    if (val > maxVal) {
      maxVal = val;
      maxCat = key;
    }
  });
  return maxVal > 0 ? maxCat : "N/A";
}

export default function ComparisonSummaryTable({
  selectedChallenges,
  barData,
  stackedCategoryData,
}) {
  return (
    <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Metric</strong>
            </TableCell>
            {selectedChallenges.map((c) => (
              <TableCell key={c.id} align="right">
                <strong>{c.name}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Total Actions Completed</TableCell>
            {selectedChallenges.map((c, idx) => (
              <TableCell key={c.id} align="right">
                {numberFormatter.format(barData[idx]?.participation || 0)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Total Points Earned</TableCell>
            {selectedChallenges.map((c, idx) => (
              <TableCell key={c.id} align="right">
                {numberFormatter.format(barData[idx]?.points || 0)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Top Performing Category</TableCell>
            {selectedChallenges.map((c, idx) => (
              <TableCell key={c.id} align="right">
                {topCategoryFor(stackedCategoryData[idx])}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
