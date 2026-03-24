import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Box,
} from '@mui/material';
import { STATUS_COLOR } from '../../../lib/constants';
import EntityLink from '../../../components/EntityLink';

export default function ChallengeSummaryWidget({ data }) {
  return (
    <TableContainer sx={{ height: '100%' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Challenge</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
            <TableCell align="right">Completions</TableCell>
            <TableCell align="right">Participants</TableCell>
            <TableCell align="right">Pts Earned</TableCell>
            <TableCell align="right">Max Pts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.challengeSummary.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.theme, flexShrink: 0 }} />
                  <EntityLink type="challenges" id={c.id}>{c.name}</EntityLink>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={c.status} size="small" color={STATUS_COLOR[c.status] || 'default'} />
              </TableCell>
              <TableCell align="right">{c.actionCount}</TableCell>
              <TableCell align="right">{c.participationCount}</TableCell>
              <TableCell align="right">{c.participantCount}</TableCell>
              <TableCell align="right">{c.pointsEarned}</TableCell>
              <TableCell align="right">{c.maxPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
