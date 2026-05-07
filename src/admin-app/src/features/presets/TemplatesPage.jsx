/**
 * @file TemplatesPage.jsx
 * @summary List of saved challenge templates (reusable templates).
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";

import { ConfirmDialog } from "../../components/shared/feedback";
import { getTemplates, deleteTemplate } from "../../data/api";
import { useAuth } from "../auth/useAuth";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canManage = hasRole("Admin");

  const load = async () => {
    try {
      setTemplates(await getTemplates());
    } catch (err) {
      setError(err.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (pendingDelete) {
      await deleteTemplate(pendingDelete);
      setPendingDelete(null);
      setConfirmOpen(false);
      load();
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

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
          Challenge Templates
        </Typography>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/templates/new")}
          >
            New Template
          </Button>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Reusable templates for quickly creating new challenges with pre-configured actions.
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Theme</TableCell>
              <TableCell align="right">Actions</TableCell>
              <TableCell>Created</TableCell>
              {canManage && <TableCell align="right">Manage</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ p: 0, minWidth: "auto", textTransform: "none", fontWeight: 600 }}
                    onClick={() => navigate(`/templates/${p.id}/edit`)}
                  >
                    {p.name}
                  </Button>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(p.categories || []).map(cat => (
                      <Chip key={cat} label={cat} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        bgcolor: p.bgColorHeader || "#4CAF50",
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="caption">{p.bgColorHeader}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{p.actions?.length || 0}</TableCell>
                <TableCell>{p.createdAt}</TableCell>
                {canManage && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/templates/${p.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setPendingDelete(p.id);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {templates.length === 0 && (
              <TableRow>
                <TableCell colSpan={canManage ? 6 : 5} align="center">
                  No templates yet. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Template"
        message="Are you sure you want to delete this template? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
      />
    </Box>
  );
}
