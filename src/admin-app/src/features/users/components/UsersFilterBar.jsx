/**
 * @file UsersFilterBar.jsx
 * @summary UsersFilterBar -- search + role + group filters for the Users page.
 *
 * Pure controlled component: the parent owns the state, this only
 * renders inputs and propagates changes via callbacks.
 */

import { MenuItem, Stack, TextField } from "@mui/material";

import { ROLES } from "../../../data/api";

/**
 * @param {object} props
 * @param {string}                  props.search
 * @param {(value: string) => void} props.onSearchChange
 * @param {string}                  props.roleFilter   - role name or "All"
 * @param {(value: string) => void} props.onRoleChange
 * @param {string|number}           props.groupFilter  - group id or "All"
 * @param {(value: string) => void} props.onGroupChange
 * @param {Array<{id:number,name:string}>} props.groups
 */
export default function UsersFilterBar({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  groupFilter,
  onGroupChange,
  groups,
}) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
      <TextField
        size="small"
        label="Search users"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 220 }}
      />
      <TextField
        size="small"
        select
        label="Role"
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value)}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="All">All</MenuItem>
        {Object.values(ROLES).map((r) => (
          <MenuItem key={r} value={r}>
            {r}
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
