/**
 * UserActivityLogList -- "Admin Activity Log" section on UserDetail.
 *
 * Lists system actions like "Created challenge", "Exported report".
 * Mounted only when the viewer has VIEW_USER_ACTIVITY_LOG permission;
 * GeneralUsers typically have nothing to show.
 */

import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import CSVExport from "../../../components/shared/CSVExport";

/**
 * @param {object} props
 * @param {Array<object>} props.logs
 * @param {string}        props.userName  - used for the CSV filename
 */
export default function UserActivityLogList({ logs, userName }) {
  const filename = `${userName.replace(/\s+/g, "_")}_activity.csv`;

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        flexWrap="wrap"
        gap={1}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Admin Activity Log ({logs.length})
          </Typography>
          <Typography variant="caption" color="text.secondary">
            System actions like created challenge, exported report &mdash; admins only;
            GeneralUsers typically have none
          </Typography>
        </Box>
        <CSVExport data={logs} filename={filename} />
      </Stack>

      <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 450 }}>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.action}</TableCell>
                <TableCell>{l.details}</TableCell>
                <TableCell>{new Date(l.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No admin activity
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
