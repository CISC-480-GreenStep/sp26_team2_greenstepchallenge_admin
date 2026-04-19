/**
 * PointsHistoryTable -- two-card "Global Points + Points per Challenge"
 * stat block on UserDetail. Mounted only when the viewer has
 * VIEW_USER_POINTS permission.
 *
 * Pure presentational; the parent owns the {total, breakdown} object
 * that comes from getUserPoints(uid).
 */

import { useNavigate } from "react-router-dom";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HistoryIcon from "@mui/icons-material/History";
import PublicIcon from "@mui/icons-material/Public";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

/**
 * @param {object} props
 * @param {{ total:number, breakdown:Array<object> }} props.points
 */
export default function PointsHistoryTable({ points }) {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <PublicIcon color="primary" />
              <Typography variant="subtitle2" color="text.secondary">
                Global Points
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <EmojiEventsIcon sx={{ fontSize: 44, color: "#FFD700" }} />
              <Box>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ fontSize: { xs: "2rem", sm: "3rem" } }}
                >
                  {points.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  across {points.breakdown.length} challenge
                  {points.breakdown.length !== 1 ? "s" : ""}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 8 }}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <HistoryIcon color="primary" />
              <Typography variant="subtitle2" color="text.secondary">
                Points per Challenge (History)
              </Typography>
            </Box>

            {points.breakdown.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No participation yet
              </Typography>
            ) : (
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 450 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Challenge</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Earned</TableCell>
                      <TableCell align="right">Max</TableCell>
                      <TableCell align="right" sx={{ minWidth: 100 }}>
                        Progress
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {points.breakdown.map((b) => {
                      const pct =
                        b.maxPoints > 0 ? Math.round((b.points / b.maxPoints) * 100) : 0;
                      return (
                        <TableRow key={b.challengeId}>
                          <TableCell>
                            <Button
                              size="small"
                              sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
                              onClick={() => navigate(`/challenges/${b.challengeId}`)}
                            >
                              {b.challengeName}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Chip label={b.status} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <strong>{b.points}</strong>
                          </TableCell>
                          <TableCell align="right">{b.maxPoints}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={pct}
                                sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="caption" sx={{ minWidth: 32 }}>
                                {pct}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
