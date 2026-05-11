import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip
} from "@mui/material";
import { getIssueTickets } from "../../data/api";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getIssueTickets();
        setTickets(data);
      } catch (err) {
        setError(err.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch ((status || "open").toLowerCase()) {
      case 'new':
      case 'open': 
        return 'info'; // blue
      case 'in progress': 
        return 'warning'; // orange
      case 'closed': 
        return 'success'; // green
      default: 
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Issue Tickets
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No tickets found.</TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.name || "N/A"}</TableCell>
                  <TableCell>
                    <Chip 
                      label={ticket.status || "Open"} 
                      color={getStatusColor(ticket.status)} 
                      size="small" 
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>{ticket.createdBy || "System"}</TableCell>
                  <TableCell>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ""}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
