import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert, Snackbar,
  Tooltip, Chip, Stack, Switch, FormControlLabel, Paper,
} from '@mui/material';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import WidgetsIcon from '@mui/icons-material/Widgets';
import {
  getChallenges, getUsers, getParticipation, getActions, getLeaderboard, getGroups,
} from '../../data/api';
import useDashboardLayout from './hooks/useDashboardLayout';
import DashboardGrid from './DashboardGrid';
import WidgetCatalog from './WidgetCatalog';
import ComparisonMode from './ComparisonMode';

import StatWidget from './widgets/StatWidget';
import ChallengeSummaryWidget from './widgets/ChallengeSummaryWidget';
import CategoryPieWidget from './widgets/CategoryPieWidget';
import ParticipationBarWidget from './widgets/ParticipationBarWidget';
import LeaderboardWidget from './widgets/LeaderboardWidget';
import MostActiveUsersWidget from './widgets/MostActiveUsersWidget';
import ChallengeStatusWidget from './widgets/ChallengeStatusWidget';
import PointsByChallengeWidget from './widgets/PointsByChallengeWidget';
import UserGrowthWidget from './widgets/UserGrowthWidget';
import GroupPerformanceWidget from './widgets/GroupPerformanceWidget';
import CompletionRatesWidget from './widgets/CompletionRatesWidget';
import PointsDistributionWidget from './widgets/PointsDistributionWidget';
import RecentActivityWidget from './widgets/RecentActivityWidget';
import UpcomingChallengesWidget from './widgets/UpcomingChallengesWidget';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [selectedChallengeIds, setSelectedChallengeIds] = useState([]);
  const [allChallenges, setAllChallenges] = useState([]); 
  const [error, setError] = useState(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [isComparisonModeActive, setIsComparisonModeActive] = useState(false);

  useEffect(() => {
    if (selectedChallengeIds.length <= 1) {
      setIsComparisonModeActive(false);
    }
  }, [selectedChallengeIds]);

  const {
    visible, layouts, isEditing,
    startEditing, cancelEditing, saveLayout,
    onLayoutChange, toggleWidget, applyPreset, resetToDefault,
  } = useDashboardLayout();

  // ─── Data Loading ─────────────────────────────────────
  // ─── Data Loading ─────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [challenges, users, participation, actions, leaderboard, groups] = await Promise.all([
          getChallenges(), getUsers(), getParticipation(), getActions(), getLeaderboard(10), getGroups(),
        ]);

        setAllChallenges(challenges);

        // ─── THE FILTER ───
        const filteredParticipation = selectedChallengeIds.length > 0
          ? participation.filter(p => selectedChallengeIds.includes(p.challengeId))
          : participation;

        // Basic counts
        const activeChallenges = challenges.filter((c) => c.status === 'Active').length;
        const totalParticipation = filteredParticipation.length; // FIXED
        const activeUsers = users.filter((u) => u.status === 'Active').length;
        
        // Calculate points dynamically based on the filter
        const totalPoints = filteredParticipation.reduce((sum, p) => { // FIXED
          const action = actions.find((a) => a.id === p.actionId);
          return sum + (action?.points || 0);
        }, 0);

        // Derived stat values
        const usersWithActions = new Set(filteredParticipation.map((p) => p.userId)); // FIXED
        const completionRate = activeUsers > 0
          ? Math.round((usersWithActions.size / activeUsers) * 100)
          : 0;
        const avgPointsPerUser = usersWithActions.size > 0
          ? Math.round(totalPoints / usersWithActions.size)
          : 0;

        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const newUsersThisMonth = users.filter((u) => u.createdAt?.startsWith(currentMonth)).length;

        // Category data
        const byCategory = {};
        filteredParticipation.forEach((p) => { // FIXED
          const action = actions.find((a) => a.id === p.actionId);
          if (action) byCategory[action.category] = (byCategory[action.category] || 0) + 1;
        });
        const categoryData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
        const topCategory = categoryData.length > 0
          ? categoryData.reduce((a, b) => (a.value > b.value ? a : b)).name
          : 'N/A';

        // Challenge summary
        const challengeSummary = challenges
          .filter((c) => c.status !== 'Archived')
          .map((c) => {
            const cActions = actions.filter((a) => (c.actionIds || []).includes(a.id));
            const cPart = participation.filter((p) => p.challengeId === c.id);
            const maxPoints = cActions.reduce((sum, a) => sum + a.points, 0);
            const pointsEarned = cPart.reduce((sum, p) => {
              const action = actions.find((a) => a.id === p.actionId);
              return sum + (action?.points || 0);
            }, 0);
            return {
              id: c.id, name: c.name, status: c.status, theme: c.theme,
              actionCount: cActions.length,
              participationCount: cPart.length,
              participantCount: c.participantCount,
              maxPoints, pointsEarned,
            };
          });

        // Participation by challenge (bar chart)
        const participationByEvent = challengeSummary.map((c) => ({
          name: c.name.length > 18 ? c.name.slice(0, 18) + '\u2026' : c.name,
          participants: c.participantCount,
          actions: c.participationCount,
        }));

        // Comparison Mode Data
        let comparisonData = [];
        if (selectedChallengeIds.length > 1) {
          const validParticipation = participation.filter(p => selectedChallengeIds.includes(p.challengeId));
          const challengeMap = new Map();
          selectedChallengeIds.forEach(id => {
            const ch = challenges.find(c => c.id === id);
            if (ch) challengeMap.set(id, { name: ch.name, startDate: ch.startDate ? new Date(ch.startDate.slice(0, 10)) : null });
          });

          // Step 1: Pre-calculate relative days and find maxDay
          const processedRecords = [];
          let maxDay = 0;
          
          validParticipation.forEach((p) => {
            const chInfo = challengeMap.get(p.challengeId);
            if (!chInfo || !chInfo.startDate || !p.completedAt) return;
            
            const completedDate = new Date(p.completedAt.slice(0, 10));
            const diffTime = completedDate.getTime() - chInfo.startDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
            
            if (diffDays >= 0) {
              processedRecords.push({ diffDays, challengeName: chInfo.name });
              if (diffDays > maxDay) maxDay = diffDays;
            }
          });

          // Step 2: Initialize day array strictly from zero to maxDay
          for (let i = 0; i <= maxDay; i++) {
            const dayObj = { relativeDay: i };
            challengeMap.forEach((chInfo) => {
              dayObj[chInfo.name] = 0;
            });
            comparisonData.push(dayObj);
          }

          // Step 3: Populate the counts
          processedRecords.forEach(record => {
            comparisonData[record.diffDays][record.challengeName] += 1;
          });
        }

        // Challenge status breakdown (donut)
        const statusCounts = {};
        challenges.forEach((c) => {
          statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
        });
        const challengeStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

        // Points by challenge
        const pointsByChallengeData = challengeSummary.map((c) => ({
          name: c.name.length > 15 ? c.name.slice(0, 15) + '\u2026' : c.name,
          earned: c.pointsEarned,
          max: c.maxPoints,
        }));

        // User growth over time
        const usersByMonth = {};
        users.forEach((u) => {
          if (u.createdAt) {
            const month = u.createdAt.slice(0, 7);
            usersByMonth[month] = (usersByMonth[month] || 0) + 1;
          }
        });
        let cumulative = 0;
        const userGrowthData = Object.entries(usersByMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, count]) => {
            cumulative += count;
            return { month, newUsers: count, cumulative };
          });

        // Group performance
        const groupPerformanceData = groups.map((g) => {
          const groupUsers = users.filter((u) => u.groupId === g.id);
          const groupUserIds = new Set(groupUsers.map((u) => u.id));
          const groupPart = filteredParticipation.filter((p) => groupUserIds.has(p.userId)); // FIXED
          const groupPoints = groupPart.reduce((sum, p) => {
            const action = actions.find((a) => a.id === p.actionId);
            return sum + (action?.points || 0);
          }, 0);
          return {
            name: g.name,
            participants: new Set(groupPart.map((p) => p.userId)).size,
            points: groupPoints,
          };
        });

        // Completion rates per challenge
        const completionRatesData = challenges
          .filter((c) => c.status !== 'Archived')
          .map((c) => {
            const cActions = actions.filter((a) => (c.actionIds || []).includes(a.id));
            const totalPossible = cActions.length * Math.max(c.participantCount || 1, 1);
            const completed = filteredParticipation.filter((p) => p.challengeId === c.id).length; // FIXED
            const rate = totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
            return {
              name: c.name.length > 20 ? c.name.slice(0, 20) + '\u2026' : c.name,
              rate: Math.min(rate, 100),
            };
          });

        // Points distribution histogram
        const pointsByUser = {};
        filteredParticipation.forEach((p) => { // FIXED
          const action = actions.find((a) => a.id === p.actionId);
          if (action) pointsByUser[p.userId] = (pointsByUser[p.userId] || 0) + action.points;
        });
        const userPointValues = Object.values(pointsByUser);
        const maxPts = Math.max(...userPointValues, 1);
        const bucketSize = Math.max(Math.ceil(maxPts / 5), 10);
        const buckets = {};
        for (let i = 0; i <= maxPts; i += bucketSize) {
          buckets[`${i}\u2013${i + bucketSize - 1}`] = 0;
        }
        userPointValues.forEach((pts) => {
          const idx = Math.floor(pts / bucketSize) * bucketSize;
          const label = `${idx}\u2013${idx + bucketSize - 1}`;
          if (buckets[label] !== undefined) buckets[label]++;
        });
        const pointsDistributionData = Object.entries(buckets).map(([range, count]) => ({ range, count }));

        // Most active users
        const actionsByUser = {};
        filteredParticipation.forEach((p) => { // FIXED
          actionsByUser[p.userId] = (actionsByUser[p.userId] || 0) + 1;
        });
        const mostActive = Object.entries(actionsByUser)
          .map(([uid, count]) => {
            const u = users.find((u) => u.id === Number(uid));
            return { userId: Number(uid), name: u?.name || 'Unknown', actionCount: count };
          })
          .sort((a, b) => b.actionCount - a.actionCount)
          .slice(0, 10);

        // Recent activity feed
        const recentActivity = [...filteredParticipation] // FIXED
          .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
          .slice(0, 15)
          .map((p) => {
            const user = users.find((u) => u.id === p.userId);
            const action = actions.find((a) => a.id === p.actionId);
            const challenge = challenges.find((c) => c.id === p.challengeId);
            return {
              id: p.id,
              userName: user?.name || 'Unknown',
              actionName: action?.name || 'Unknown',
              challengeName: challenge?.name || 'Unknown',
              completedAt: p.completedAt,
              userId: p.userId,
              challengeId: p.challengeId,
            };
          });

        // Upcoming challenges
        const upcomingChallenges = challenges
          .filter((c) => c.status === 'Upcoming')
          .map((c) => ({
            id: c.id, name: c.name, description: c.description,
            startDate: c.startDate, endDate: c.endDate,
            category: c.category, theme: c.theme,
          }));

        setStats({
          activeChallenges, totalParticipation, activeUsers, totalPoints,
          completionRate, avgPointsPerUser, newUsersThisMonth, topCategory,
          challengeSummary, categoryData, participationByEvent, comparisonData,
          challengeStatusData, pointsByChallengeData, userGrowthData,
          groupPerformanceData, completionRatesData, pointsDistributionData,
          leaderboard, mostActive, recentActivity, upcomingChallenges,
          rawParticipation: participation, rawActions: actions,
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      }
    }
    load();
  }, [selectedChallengeIds]);

  // ─── Widget Renderer ──────────────────────────────────
  const renderWidget = (id) => {
    if (!stats) return null;
    if (id.startsWith('stat-')) return <StatWidget data={stats} widgetId={id} />;
    const map = {
      'table-challenge-summary': ChallengeSummaryWidget,
      'chart-category-pie': CategoryPieWidget,
      'chart-participation-bar': ParticipationBarWidget,
      'list-leaderboard': LeaderboardWidget,
      'table-most-active': MostActiveUsersWidget,
      'chart-challenge-status': ChallengeStatusWidget,
      'chart-points-by-challenge': PointsByChallengeWidget,
      'chart-user-growth': UserGrowthWidget,
      'chart-group-performance': GroupPerformanceWidget,
      'chart-completion-rates': CompletionRatesWidget,
      'chart-points-distribution': PointsDistributionWidget,
      'list-recent-activity': RecentActivityWidget,
      'list-upcoming': UpcomingChallengesWidget,
    };
    const Component = map[id];
    return Component ? <Component data={stats} /> : null;
  };

  // ─── Handlers ─────────────────────────────────────────
  const handleSave = () => {
    saveLayout();
    setSnackbar('Dashboard layout saved!');
  };

  const handleApplyPreset = (presetId) => {
    applyPreset(presetId);
    setSnackbar('Layout preset applied \u2014 drag to customize further');
  };

  const handleReset = () => {
    resetToDefault();
    setCatalogOpen(false);
    setSnackbar('Dashboard reset to default layout');
  };

  const handleToggleChallenge = (id) => {
  setSelectedChallengeIds((prev) =>
    prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
  );
};

const handleClearFilters = () => setSelectedChallengeIds([]);
  // ─── Render ───────────────────────────────────────────
  if (!stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* ── Toolbar ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, mr: 'auto' }}
        >
          Dashboard
        </Typography>

        {isEditing ? (
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip label="Editing Layout" color="primary" size="small" />
            <Button
              size="small"
              variant="outlined"
              startIcon={<WidgetsIcon />}
              onClick={() => setCatalogOpen(true)}
            >
              Widgets
            </Button>
            <Button size="small" variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Save
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<CloseIcon />}
              onClick={cancelEditing}
            >
              Cancel
            </Button>
          </Stack>
        ) : (
          <Tooltip title="Rearrange, resize, and choose which widgets appear on your dashboard" arrow>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DashboardCustomizeIcon />}
              onClick={startEditing}
            >
              Customize
            </Button>
          </Tooltip>
        )}
      </Box>

      {/* ── Edit-mode instruction banner ── */}
      {isEditing && (
        <Alert severity="info" sx={{ mb: 2 }} icon={false}>
          <strong>Drag</strong> widgets by their title bar to rearrange &bull;{' '}
          <strong>Resize</strong> from the bottom-right corner &bull;{' '}
          Click <strong>Widgets</strong> to add, remove, or apply a preset layout
        </Alert>
      )}

      {selectedChallengeIds.length > 1 && isComparisonModeActive && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Comparison Mode Active:</strong> Data is currently normalized to "Days Since Launch" for accurate head-to-head comparison.
        </Alert>
      )}

      {/* ── Contextual Quick Toggle ── */}
      {selectedChallengeIds.length > 1 && (
        <Paper sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'background.paper' }}>
          <Typography fontWeight={600}>
            Comparing {selectedChallengeIds.length} Selected Challenges
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isComparisonModeActive}
                onChange={(e) => setIsComparisonModeActive(e.target.checked)}
                color="primary"
              />
            }
            label="Comparison Mode"
            sx={{ m: 0 }}
          />
        </Paper>
      )}

      {/* ── Widget Grid / Comparison Mode ── */}
      {selectedChallengeIds.length > 1 && isComparisonModeActive ? (
        <ComparisonMode
          stats={stats}
          challenges={allChallenges}
          selectedChallengeIds={selectedChallengeIds}
        />
      ) : (
        <DashboardGrid
          visible={visible}
          layouts={layouts}
          isEditing={isEditing}
          onLayoutChange={onLayoutChange}
          onRemoveWidget={toggleWidget}
          renderWidget={renderWidget}
        />
      )}

      {/* ── Widget Catalog Drawer ── */}
      <WidgetCatalog
  open={catalogOpen}
  onClose={() => setCatalogOpen(false)}
  visible={visible}
  onToggle={toggleWidget}
  onApplyPreset={handleApplyPreset}
  onReset={handleReset}
  challenges={allChallenges}
  selectedChallengeIds={selectedChallengeIds}
  onToggleChallenge={handleToggleChallenge}
  onClearFilters={handleClearFilters}
  isComparisonModeActive={isComparisonModeActive}
  setIsComparisonModeActive={setIsComparisonModeActive}
/>

      {/* ── Feedback Snackbar ── */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
