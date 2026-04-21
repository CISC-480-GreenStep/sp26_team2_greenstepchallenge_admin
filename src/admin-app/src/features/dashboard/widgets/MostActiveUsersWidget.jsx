/**
 * @file MostActiveUsersWidget.jsx
 * @summary Table of users with the highest action counts in the current period.
 */

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
} from "@mui/material";

import { EntityLink } from "../../../components/shared/data";

export default function MostActiveUsersWidget({ data }) {
  if (data.mostActive.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
        No activity yet
      </Typography>
    );
  }

  return (
    <TableContainer sx={{ height: "100%" }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Actions Completed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.mostActive.map((entry, i) => (
            <TableRow key={entry.userId}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                <EntityLink type="users" id={entry.userId}>
                  {entry.name}
                </EntityLink>
              </TableCell>
              <TableCell align="right">
                <Chip label={entry.actionCount} size="small" color="primary" variant="outlined" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
