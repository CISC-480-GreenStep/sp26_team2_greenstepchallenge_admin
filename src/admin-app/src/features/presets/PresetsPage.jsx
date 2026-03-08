import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPresets, deletePreset } from '../../data/api';
import { useAuth } from '../auth/AuthContext';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function PresetsPage() {
  const [presets, setPresets] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canManage = hasRole('Admin');

  const load = async () => {
    setPresets(await getPresets());
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (pendingDelete) {
      await deletePreset(pendingDelete);
      setPendingDelete(null);
      setConfirmOpen(false);
      load();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Challenge Presets
        </Typography>
        {canManage && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/presets/new')}>
            New Preset
          </Button>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Reusable templates for quickly creating new challenges with pre-configured actions.
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Theme</TableCell>
              <TableCell align="right">Actions</TableCell>
              <TableCell>Created</TableCell>
              {canManage && <TableCell align="right">Manage</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {presets.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Button
                    size="small"
                    sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 600 }}
                    onClick={() => navigate(`/presets/${p.id}/edit`)}
                  >
                    {p.name}
                  </Button>
                </TableCell>
                <TableCell>
                  <Chip label={p.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: p.theme, flexShrink: 0 }} />
                    <Typography variant="caption">{p.theme}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{p.actions?.length || 0}</TableCell>
                <TableCell>{p.createdAt}</TableCell>
                {canManage && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/presets/${p.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => { setPendingDelete(p.id); setConfirmOpen(true); }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {presets.length === 0 && (
              <TableRow>
                <TableCell colSpan={canManage ? 6 : 5} align="center">
                  No presets yet. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Preset"
        message="Are you sure you want to delete this preset? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDelete(null); }}
      />
    </Box>
  );
}
