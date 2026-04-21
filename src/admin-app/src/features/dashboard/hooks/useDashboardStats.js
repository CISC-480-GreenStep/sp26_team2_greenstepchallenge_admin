/**
 * @file useDashboardStats.js
 * @summary Loads every dataset the dashboard needs and derives the
 * single `stats` object consumed by all 22 widgets.
 *
 * Why a hook instead of inline state in DashboardPage:
 *   - Keeps the page component small and testable.
 *   - Centralizes the one Promise.all that fans out to the data layer.
 *   - Recomputes derived stats whenever `selectedChallengeIds` changes
 *     so the filter chip in the catalog drives every chart.
 *
 * Pure aggregators live in `./aggregations.js` so this file owns the
 * orchestration only and the math stays unit-testable in isolation.
 */

import { useEffect, useState } from "react";

import {
  buildCategoryData,
  buildChallengeSummary,
  buildCompletionRates,
  buildComparisonData,
  buildGroupPerformance,
  buildMostActiveUsers,
  buildPointsDistribution,
  buildRecentActivity,
  buildStatusBreakdown,
  buildUserGrowth,
  countUsersCreatedThisMonth,
  sumPoints,
  truncate,
} from "./aggregations";
import {
  getActions,
  getChallenges,
  getGroups,
  getLeaderboard,
  getParticipation,
  getUsers,
} from "../../../data/api";

const ACTIVE = "Active";
const UPCOMING = "Upcoming";
const LEADERBOARD_LIMIT = 10;

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

/**
 * Pure aggregator orchestrator: takes the raw rows from Supabase and
 * produces the single `stats` object every widget reads from. Pulled
 * out of the effect so it stays unit-testable; delegates the per-shape
 * math to `./aggregations.js`.
 */
function buildStats({
  challenges,
  users,
  participation,
  actions,
  leaderboard,
  groups,
  selectedChallengeIds,
}) {
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

  const { categoryData, topCategory } = buildCategoryData(filteredParticipation, actions);
  const challengeSummary = buildChallengeSummary(challenges, actions, participation);
  const participationByEvent = challengeSummary.map((c) => ({
    name: truncate(c.name, 18),
    participants: c.participantCount,
    actions: c.participationCount,
  }));
  const pointsByChallengeData = challengeSummary.map((c) => ({
    name: truncate(c.name, 15),
    earned: c.pointsEarned,
    max: c.maxPoints,
  }));

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
    newUsersThisMonth: countUsersCreatedThisMonth(users),
    topCategory,
    challengeSummary,
    categoryData,
    participationByEvent,
    comparisonData: buildComparisonData(challenges, participation, selectedChallengeIds),
    challengeStatusData: buildStatusBreakdown(challenges),
    pointsByChallengeData,
    userGrowthData: buildUserGrowth(users),
    groupPerformanceData: buildGroupPerformance(groups, users, filteredParticipation, actions),
    completionRatesData: buildCompletionRates(challenges, actions, filteredParticipation),
    pointsDistributionData: buildPointsDistribution(filteredParticipation, actions),
    leaderboard,
    mostActive: buildMostActiveUsers(filteredParticipation, users),
    recentActivity: buildRecentActivity(filteredParticipation, users, actions, challenges),
    upcomingChallenges,
    rawParticipation: participation,
    rawActions: actions,
  };
}
