import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Chip
} from "@mui/material";
import { getBadges } from "../../data/api";

export default function BadgesPage() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBadges();
        setBadges(data);
      } catch (err) {
        setError(err.message || "Failed to load badges");
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Badges
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {badges.length === 0 && !error && (
        <Typography>No badges found.</Typography>
      )}

      <Grid container spacing={3}>
        {badges.map((badge) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={badge.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <CardMedia
                component="img"
                image={badge.iconUrl || "https://placehold.co/100x100?text=Badge"}
                alt={badge.name}
                sx={{ width: 100, height: 100, objectFit: 'contain', mb: 2, borderRadius: '50%' }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 0, pb: '0 !important' }}>
                <Typography variant="h6" gutterBottom sx={{ lineHeight: 1.2 }}>
                  {badge.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {badge.description}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Chip 
                    label={`${badge.points || 0} XP`} 
                    color="primary" 
                    size="small" 
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
