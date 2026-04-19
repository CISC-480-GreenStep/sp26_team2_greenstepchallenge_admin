/**
 * @file ChallengesFilterBar.jsx
 * @summary Search + status + group filters above the Challenges table.
 *
 * Pure controlled component: parent owns the filter state and re-derives
 * the visible rows. Mirrors the pattern used by `UsersFilterBar`.
 */

import { Stack, TextField, MenuItem } from "@mui/material";

import { CHALLENGE_STATUSES } from "../../../data/api";

/**
 * @param {object} props
 * @param {string} props.search - Current search text.
 * @param {(value: string) => void} props.onSearchChange
 * @param {string} props.statusFilter - Selected status, or "All".
 * @param {(value: string) => void} props.onStatusChange
 * @param {string} props.groupFilter - Selected group id (as string) or "All".
 * @param {(value: string) => void} props.onGroupChange
 * @param {object[]} props.groups - All groups (for the dropdown).
 */
export default function ChallengesFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  groupFilter,
  onGroupChange,
  groups,
}) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
      <TextField
        size="small"
        label="Search challenges"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 220 }}
      />
      <TextField
        size="small"
        select
        label="Status"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="All">All</MenuItem>
        {Object.values(CHALLENGE_STATUSES).map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        select
        label="Group"
        value={groupFilter}
        onChange={(e) => onGroupChange(e.target.value)}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="All">All Groups</MenuItem>
        {groups.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
