/**
 * useDashboardStats -- loads every dataset the dashboard needs and
 * derives the aggregated `stats` object consumed by all 22 widgets.
 *
 * Why a hook instead of inline state in DashboardPage:
 *   - Keeps the page component small and testable.
 *   - Centralizes the (one) Promise.all that fans out to the data layer.
 *   - Recomputes derived stats whenever `selectedChallengeIds` changes
 *     so the filter chip in the catalog drives every chart.
 *
 * The aggregation is intentionally pure JS over the raw rows (rather
 * than SQL views) so the same code can run against the local mock data
 * during development. Revisit if performance ever matters.
 *
 * File size note: this module sits in the 301-500 band per the tiered
 * policy in CODING_GUIDELINES.md section 3. Splitting the small pure
 * helpers into a separate file would hide them from buildStats and
 * fragment a single conceptual pipeline; kept together on purpose.
 */

import { useEffect, useState } from "react";

import {
  getActions,
  getChallenges,
  getGroups,
  getLeaderboard,
  getParticipation,
  getUsers,
} from "../../../data/api";

const ACTIVE = "Active";
const ARCHIVED = "Archived";
const UPCOMING = "Upcoming";
const LEADERBOARD_LIMIT = 10;
const RECENT_ACTIVITY_LIMIT = 15;
const MOST_ACTIVE_LIMIT = 10;
const HISTOGRAM_BUCKETS = 5;

/**
 * @param {Array<number>} selectedChallengeIds Ids the user has filtered to.
 *   When empty, stats are computed across every challenge.
 * @returns {{
 *   stats: object | null,
 *   allChallenges: Array<object>,
 *   error: string | null,
 * }}
 */
export default function useDashboardStats(selectedChallengeIds) {
  const [stats, setStats] = useState(null);
  const [allChallenges, setAllChallenges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [challenges, users, participation, actions, leaderboard, groups] = await Promise.all([
          getChallenges(),
          getUsers(),
          getParticipation(),
          getActions(),
          getLeaderboard(LEADERBOARD_LIMIT),
          getGroups(),
        ]);

        setAllChallenges(challenges);
        setStats(
          buildStats({
            challenges,
            users,
            participation,
            actions,
            leaderboard,
            groups,
            selectedChallengeIds,
          }),
        );
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      }
    }
    load();
  }, [selectedChallengeIds]);

  return { stats, allChallenges, error };
}

// --- Aggregation pipeline ------------------------------------------------

/**
 * Pure aggregator: takes the raw rows from Supabase and produces the
 * single `stats` object every widget reads from. Pulled out of the
 * effect so it stays unit-testable.
 */
function buildStats({ challenges, users, participation, actions, leaderboard, groups, selectedChallengeIds }) {
  const filteredParticipation =
    selectedChallengeIds.length > 0
      ? participation.filter((p) => selectedChallengeIds.includes(p.challengeId))
      : participation;

  const activeChallenges = challenges.filter((c) => c.status === ACTIVE).length;
  const totalParticipation = filteredParticipation.length;
  const activeUsers = users.filter((u) => u.status === ACTIVE).length;

  const totalPoints = sumPoints(filteredParticipation, actions);
  const usersWithActions = new Set(filteredParticipation.map((p) => p.userId));
  const completionRate =
    activeUsers > 0 ? Math.round((usersWithActions.size / activeUsers) * 100) : 0;
  const avgPointsPerUser =
    usersWithActions.size > 0 ? Math.round(totalPoints / usersWithActions.size) : 0;

  const newUsersThisMonth = countUsersCreatedThisMonth(users);

  const { categoryData, topCategory } = buildCategoryData(filteredParticipation, actions);
  const challengeSummary = buildChallengeSummary(challenges, actions, participation);
  const participationByEvent = challengeSummary.map((c) => ({
    name: truncate(c.name, 18),
    participants: c.participantCount,
    actions: c.participationCount,
  }));

  const comparisonData = buildComparisonData(challenges, participation, selectedChallengeIds);
  const challengeStatusData = buildStatusBreakdown(challenges);
  const pointsByChallengeData = challengeSummary.map((c) => ({
    name: truncate(c.name, 15),
    earned: c.pointsEarned,
    max: c.maxPoints,
  }));
  const userGrowthData = buildUserGrowth(users);
  const groupPerformanceData = buildGroupPerformance(groups, users, filteredParticipation, actions);
  const completionRatesData = buildCompletionRates(challenges, actions, filteredParticipation);
  const pointsDistributionData = buildPointsDistribution(filteredParticipation, actions);
  const mostActive = buildMostActiveUsers(filteredParticipation, users);
  const recentActivity = buildRecentActivity(filteredParticipation, users, actions, challenges);
  const upcomingChallenges = challenges
    .filter((c) => c.status === UPCOMING)
    .map(({ id, name, description, startDate, endDate, category, theme }) => ({
      id,
      name,
      description,
      startDate,
      endDate,
      category,
      theme,
    }));

  return {
    activeChallenges,
    totalParticipation,
    activeUsers,
    totalPoints,
    completionRate,
    avgPointsPerUser,
    newUsersThisMonth,
    topCategory,
    challengeSummary,
    categoryData,
    participationByEvent,
    comparisonData,
    challengeStatusData,
    pointsByChallengeData,
    userGrowthData,
    groupPerformanceData,
    completionRatesData,
    pointsDistributionData,
    leaderboard,
    mostActive,
    recentActivity,
    upcomingChallenges,
    rawParticipation: participation,
    rawActions: actions,
  };
}

// --- Small pure helpers --------------------------------------------------

function truncate(s, max) {
  return s.length > max ? `${s.slice(0, max)}\u2026` : s;
}

function sumPoints(rows, actions) {
  return rows.reduce((sum, p) => {
    const a = actions.find((x) => x.id === p.actionId);
    return sum + (a?.points || 0);
  }, 0);
}

function countUsersCreatedThisMonth(users) {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return users.filter((u) => u.createdAt?.startsWith(month)).length;
}

function buildCategoryData(rows, actions) {
  const byCategory = {};
  rows.forEach((p) => {
    const a = actions.find((x) => x.id === p.actionId);
    if (a) byCategory[a.category] = (byCategory[a.category] || 0) + 1;
  });
  const categoryData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
  const topCategory =
    categoryData.length > 0
      ? categoryData.reduce((a, b) => (a.value > b.value ? a : b)).name
      : "N/A";
  return { categoryData, topCategory };
}

function buildChallengeSummary(challenges, actions, participation) {
  return challenges
    .filter((c) => c.status !== ARCHIVED)
    .map((c) => {
      const cActions = actions.filter((a) => (c.actionIds || []).includes(a.id));
      const cPart = participation.filter((p) => p.challengeId === c.id);
      const maxPoints = cActions.reduce((sum, a) => sum + a.points, 0);
      const pointsEarned = sumPoints(cPart, actions);
      return {
        id: c.id,
        name: c.name,
        status: c.status,
        theme: c.theme,
        actionCount: cActions.length,
        participationCount: cPart.length,
        participantCount: c.participantCount,
        maxPoints,
        pointsEarned,
      };
    });
}

/**
 * Normalize multi-challenge participation to "days since launch" so the
 * Comparison Mode chart can overlay challenges that started on different
 * dates. Returns an empty array when fewer than two challenges are picked.
 */
function buildComparisonData(challenges, participation, selectedChallengeIds) {
  if (selectedChallengeIds.length <= 1) return [];

  const validParticipation = participation.filter((p) =>
    selectedChallengeIds.includes(p.challengeId),
  );
  const challengeMap = new Map();
  selectedChallengeIds.forEach((id) => {
    const ch = challenges.find((c) => c.id === id);
    if (ch) {
      challengeMap.set(id, {
        name: ch.name,
        startDate: ch.startDate ? new Date(ch.startDate.slice(0, 10)) : null,
      });
    }
  });

  const processed = [];
  let maxDay = 0;
  validParticipation.forEach((p) => {
    const info = challengeMap.get(p.challengeId);
    if (!info?.startDate || !p.completedAt) return;
    const completed = new Date(p.completedAt.slice(0, 10));
    const diffDays = Math.round(
      (completed.getTime() - info.startDate.getTime()) / (1000 * 3600 * 24),
    );
    if (diffDays >= 0) {
      processed.push({ diffDays, challengeName: info.name });
      if (diffDays > maxDay) maxDay = diffDays;
    }
  });

  const series = [];
  for (let i = 0; i <= maxDay; i++) {
    const dayObj = { relativeDay: i };
    challengeMap.forEach((info) => {
      dayObj[info.name] = 0;
    });
    series.push(dayObj);
  }
  processed.forEach((r) => {
    series[r.diffDays][r.challengeName] += 1;
  });
  return series;
}

function buildStatusBreakdown(challenges) {
  const counts = {};
  challenges.forEach((c) => {
    counts[c.status] = (counts[c.status] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function buildUserGrowth(users) {
  const usersByMonth = {};
  users.forEach((u) => {
    if (u.createdAt) {
      const month = u.createdAt.slice(0, 7);
      usersByMonth[month] = (usersByMonth[month] || 0) + 1;
    }
  });
  let cumulative = 0;
  return Object.entries(usersByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => {
      cumulative += count;
      return { month, newUsers: count, cumulative };
    });
}

function buildGroupPerformance(groups, users, participation, actions) {
  return groups.map((g) => {
    const groupUsers = users.filter((u) => u.groupId === g.id);
    const groupUserIds = new Set(groupUsers.map((u) => u.id));
    const groupPart = participation.filter((p) => groupUserIds.has(p.userId));
    return {
      name: g.name,
      participants: new Set(groupPart.map((p) => p.userId)).size,
      points: sumPoints(groupPart, actions),
    };
  });
}

function buildCompletionRates(challenges, actions, participation) {
  return challenges
    .filter((c) => c.status !== ARCHIVED)
    .map((c) => {
      const cActions = actions.filter((a) => (c.actionIds || []).includes(a.id));
      const totalPossible = cActions.length * Math.max(c.participantCount || 1, 1);
      const completed = participation.filter((p) => p.challengeId === c.id).length;
      const rate = totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
      return { name: truncate(c.name, 20), rate: Math.min(rate, 100) };
    });
}

function buildPointsDistribution(participation, actions) {
  const pointsByUser = {};
  participation.forEach((p) => {
    const a = actions.find((x) => x.id === p.actionId);
    if (a) pointsByUser[p.userId] = (pointsByUser[p.userId] || 0) + a.points;
  });
  const values = Object.values(pointsByUser);
  const maxPts = Math.max(...values, 1);
  const bucketSize = Math.max(Math.ceil(maxPts / HISTOGRAM_BUCKETS), 10);
  const buckets = {};
  for (let i = 0; i <= maxPts; i += bucketSize) {
    buckets[`${i}\u2013${i + bucketSize - 1}`] = 0;
  }
  values.forEach((pts) => {
    const idx = Math.floor(pts / bucketSize) * bucketSize;
    const label = `${idx}\u2013${idx + bucketSize - 1}`;
    if (buckets[label] !== undefined) buckets[label]++;
  });
  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}

function buildMostActiveUsers(participation, users) {
  const actionsByUser = {};
  participation.forEach((p) => {
    actionsByUser[p.userId] = (actionsByUser[p.userId] || 0) + 1;
  });
  return Object.entries(actionsByUser)
    .map(([uid, count]) => {
      const u = users.find((x) => x.id === Number(uid));
      return { userId: Number(uid), name: u?.name || "Unknown", actionCount: count };
    })
    .sort((a, b) => b.actionCount - a.actionCount)
    .slice(0, MOST_ACTIVE_LIMIT);
}

function buildRecentActivity(participation, users, actions, challenges) {
  return [...participation]
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, RECENT_ACTIVITY_LIMIT)
    .map((p) => {
      const user = users.find((u) => u.id === p.userId);
      const action = actions.find((a) => a.id === p.actionId);
      const challenge = challenges.find((c) => c.id === p.challengeId);
      return {
        id: p.id,
        userName: user?.name || "Unknown",
        actionName: action?.name || "Unknown",
        challengeName: challenge?.name || "Unknown",
        completedAt: p.completedAt,
        userId: p.userId,
        challengeId: p.challengeId,
      };
    });
}
