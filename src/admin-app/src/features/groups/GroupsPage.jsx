import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getGroups, getUsers, getEvents, deleteGroup } from "../../data/api";
import { useAuth } from "../auth/AuthContext";
import ConfirmDialog from "../../components/shared/ConfirmDialog";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canManage = hasRole("Admin");

  const load = async () => {
    const [g, u, e] = await Promise.all([getGroups(), getUsers(), getEvents()]);
    setGroups(g);
    setUsers(u);
    setEvents(e);
  };
  useEffect(() => {
    load();
  }, []);

  const memberCount = (gid) => users.filter((u) => u.groupId === gid).length;
  const challengeCount = (gid) =>
    events.filter((e) => e.groupId === gid).length;

  const handleDelete = async () => {
    if (pendingDelete) {
      await deleteGroup(pendingDelete);
      setPendingDelete(null);
      setConfirmOpen(false);
      load();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
        >
          Groups
        </Typography>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/groups/new")}
          >
            New Group
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 550 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Members</TableCell>
              <TableCell align="right">Challenges</TableCell>
              <TableCell>Created</TableCell>
              {canManage && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((g) => (
              <TableRow key={g.id} hover>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 600 }}
                    onClick={() => navigate(`/groups/${g.id}`)}
                  >
                    {g.name}
                  </Button>
                </TableCell>
                <TableCell>{g.description}</TableCell>

                {/* Members - links to Users filtered by group */}
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate(`/users?groupId=${g.id}`)}
                    sx={{ fontWeight: 600 }}
                  >
                    {memberCount(g.id)}
                  </Button>
                </TableCell>

                {/* Challenges - links to Challenges filtered by group */}
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate(`/challenges?groupId=${g.id}`)}
                    sx={{ fontWeight: 600 }}
                  >
                    {challengeCount(g.id)}
                  </Button>
                </TableCell>
                <TableCell>{g.createdAt}</TableCell>
                {canManage && (
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/groups/${g.id}/edit`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setPendingDelete(g.id);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No groups yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Group"
        message="Are you sure you want to delete this group? Users and challenges in this group will become unassigned."
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
      />
    </Box>
  );
}
