/**
 * ParticipationLog -- the per-completion event log on ChallengeDetail.
 *
 * Shows one row per `participation` row (user, action, date, notes)
 * plus a CSV export button. Pure presentational; the parent supplies
 * the rows and lookup helpers.
 */

import {
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

import EntityLink from "../../../components/EntityLink";
import CSVExport from "../../../components/shared/CSVExport";

/**
 * @param {object} props
 * @param {Array<object>} props.participation Raw participation rows.
 * @param {(uid: number) => string} props.userName
 * @param {(aid: number) => string} props.actionName
 * @param {string} props.challengeName Used to build the export filename.
 */
export default function ParticipationLog({ participation, userName, actionName, challengeName }) {
  const exportRows = participation.map((p) => ({
    User: userName(p.userId),
    Action: actionName(p.actionId),
    Date: p.completedAt,
    Notes: p.notes,
  }));

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
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
          Participation Log ({participation.length})
        </Typography>
        <CSVExport
          data={exportRows}
          filename={`${challengeName.replace(/\s+/g, "_")}_participation.csv`}
        />
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participation.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <EntityLink type="users" id={p.userId}>
                    {userName(p.userId)}
                  </EntityLink>
                </TableCell>
                <TableCell>{actionName(p.actionId)}</TableCell>
                <TableCell>{p.completedAt}</TableCell>
                <TableCell>{p.notes || "\u2014"}</TableCell>
              </TableRow>
            ))}
            {participation.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No participation yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
