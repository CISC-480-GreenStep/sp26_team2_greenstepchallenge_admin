import React from 'react';
import { 
  Box, Card, CardContent, Typography, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme
} from '@mui/material';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell
} from 'recharts';

const COLORS = ['#2196F3', '#FF9800', '#4CAF50', '#F44336', '#9C27B0', '#00BCD4'];
const AVG_COLORS = ['#2E7D32', '#1976D2', '#ED6C02', '#9C27B0', '#D32F2F', '#0288D1'];

export default function ComparisonMode({ stats, challenges, selectedChallengeIds }) {
  const theme = useTheme();
  const selectedChallenges = challenges.filter(c => selectedChallengeIds.includes(c.id));
  const challengeNames = selectedChallenges.map(c => c.name);

  const barData = selectedChallenges.map((c) => {
    const cPart = stats.rawParticipation ? stats.rawParticipation.filter(p => p.challengeId === c.id) : [];
    
    let totalPoints = 0;
    cPart.forEach(p => {
      const action = stats.rawActions ? stats.rawActions.find(a => a.id === p.actionId) : null;
      if (action) {
        totalPoints += action.points;
      }
    });

    return {
      name: c.status === 'Upcoming' ? `${c.name} (Upcoming)` : c.name,
      participation: cPart.length,
      points: totalPoints,
    };
  });

  const categoryKeysSet = new Set();
  const stackedCategoryData = selectedChallenges.map((c) => {
    const dataRow = { challengeName: c.name };
    const cPart = stats.rawParticipation ? stats.rawParticipation.filter(p => p.challengeId === c.id) : [];
    
    const catCounts = {};
    cPart.forEach(p => {
      const action = stats.rawActions ? stats.rawActions.find(a => a.id === p.actionId) : null;
      if (action && action.category) {
        catCounts[action.category] = (catCounts[action.category] || 0) + 1;
        categoryKeysSet.add(action.category);
      }
    });

    return { ...dataRow, ...catCounts };
  });
  const categoryKeys = Array.from(categoryKeysSet);

  const avgActionsData = selectedChallenges.map((c) => {
    const cPart = stats.rawParticipation ? stats.rawParticipation.filter(p => p.challengeId === c.id) : [];
    const totalActions = cPart.length;
    const uniqueUsersSet = new Set(cPart.map(p => p.userId));
    const uniqueUsers = uniqueUsersSet.size;
    
    let averageActions = 0;
    if (uniqueUsers > 0) {
      averageActions = Number((totalActions / uniqueUsers).toFixed(1));
    }

    return {
      name: c.status === 'Upcoming' ? `${c.name} (Upcoming)` : c.name,
      averageActions,
    };
  });

  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  const dynamicHeight = Math.max(450, 300 + (selectedChallengeIds.length * 35));

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ resize: 'both', overflow: 'auto', width: '100%', minHeight: dynamicHeight, padding: 2, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Relative Engagement Trend</Typography>
              <Box sx={{ width: '100%', flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer key={selectedChallengeIds.join('-')} width="100%" height={dynamicHeight}>
                  <LineChart data={stats.comparisonData} margin={{ top: 20, right: 30, left: 30, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="relativeDay" 
                      label={{ value: 'Days Since Launch', position: 'insideBottom', offset: -10, style: { fill: theme.palette.text.primary } }} 
                      interval={0} 
                      angle={-35} 
                      textAnchor="end" 
                      tickFormatter={(value) => String(value).length > 25 ? String(value).substring(0, 25) + '...' : value}
                    />
                    <YAxis label={{ value: 'Actions Completed', angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle', fill: theme.palette.text.primary } }} />
                    <Tooltip shared={true} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                    {selectedChallenges.map((c, index) => (
                      <Line
                        key={c.name}
                        type="monotone"
                        dataKey={c.name}
                        name={c.status === 'Upcoming' ? `${c.name} (Upcoming)` : c.name}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls={true}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ resize: 'both', overflow: 'auto', width: '100%', minHeight: dynamicHeight, padding: 2, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Action Category Breakdown</Typography>
              <Box sx={{ width: '100%', flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer key={selectedChallengeIds.join('-')} width="100%" height={dynamicHeight}>
                  <BarChart data={stackedCategoryData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="challengeName" 
                      orientation="top"
                      interval={0} 
                      tickFormatter={(value) => String(value).length > 20 ? String(value).substring(0, 20) + '...' : value}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {categoryKeys.map((key, index) => (
                      <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ resize: 'both', overflow: 'auto', width: '100%', minHeight: dynamicHeight, padding: 2, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Total Participation & Points Comparison</Typography>
              <Box sx={{ width: '100%', flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer key={selectedChallengeIds.join('-')} width="100%" height={dynamicHeight}>
                  <BarChart data={barData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      orientation="top"
                      interval={0} 
                      tickFormatter={(value) => String(value).length > 20 ? String(value).substring(0, 20) + '...' : value}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="participation" name="Total Actions" fill="#2196F3" />
                    <Bar dataKey="points" name="Total Points" fill="#FF9800" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ resize: 'both', overflow: 'auto', width: '100%', minHeight: dynamicHeight, padding: 2, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Average Actions Per User</Typography>
              <Box sx={{ width: '100%', flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer key={selectedChallengeIds.join('-')} width="100%" height={dynamicHeight}>
                  <BarChart data={avgActionsData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      orientation="top"
                      interval={0} 
                      tickFormatter={(value) => String(value).length > 20 ? String(value).substring(0, 20) + '...' : value}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageActions" name="Avg Actions">
                      {avgActionsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={AVG_COLORS[index % AVG_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Metric</strong></TableCell>
                  {selectedChallenges.map((c) => (
                    <TableCell key={c.id} align="right"><strong>{c.name}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total Actions Completed</TableCell>
                  {selectedChallenges.map((c, idx) => (
                    <TableCell key={c.id} align="right">{formatNumber(barData[idx]?.participation || 0)}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Total Points Earned</TableCell>
                  {selectedChallenges.map((c, idx) => (
                    <TableCell key={c.id} align="right">{formatNumber(barData[idx]?.points || 0)}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Top Performing Category</TableCell>
                  {selectedChallenges.map((c, idx) => {
                    const dataRow = stackedCategoryData[idx];
                    let maxCat = 'N/A';
                    let maxVal = 0;
                    if (dataRow) {
                      Object.entries(dataRow).forEach(([key, val]) => {
                        if (key !== 'challengeName') {
                          if (val > maxVal) { maxVal = val; maxCat = key; }
                        }
                      });
                    }
                    return <TableCell key={c.id} align="right">{maxVal > 0 ? maxCat : 'N/A'}</TableCell>;
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
