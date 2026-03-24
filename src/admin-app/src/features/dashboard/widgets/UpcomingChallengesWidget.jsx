import { Box, Typography, Chip, Stack } from '@mui/material';
import EntityLink from '../../../components/EntityLink';

export default function UpcomingChallengesWidget({ data }) {
  if (!data.upcomingChallenges?.length) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
        No upcoming challenges scheduled
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ height: '100%', overflow: 'auto' }}>
      {data.upcomingChallenges.map((c) => (
        <Box
          key={c.id}
          sx={{
            p: 1.5,
            borderRadius: 1,
            bgcolor: 'grey.50',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.theme, flexShrink: 0 }} />
            <Typography variant="body2" fontWeight={600}>
              <EntityLink type="challenges" id={c.id}>{c.name}</EntityLink>
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {c.startDate} &rarr; {c.endDate}
          </Typography>
          {c.category && (
            <Chip label={c.category} size="small" sx={{ ml: 1, fontSize: 10, height: 20 }} />
          )}
        </Box>
      ))}
    </Stack>
  );
}
