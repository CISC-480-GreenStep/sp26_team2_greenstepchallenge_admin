/**
 * @file aggregations.js
 * @summary Pure aggregators consumed by `useDashboardStats`.
 *
 * Each function takes raw rows from the data layer and returns the
 * shape one or more dashboard widgets renders. Keeping them pure (no
 * React, no fetch) makes them trivial to unit-test and lets the hook
 * orchestrate without owning the math.
 *
 * If you add a new widget that needs derived data, add a builder here
 * and call it from `buildStats` in `useDashboardStats.js`.
 */

const ARCHIVED = "Archived";
const HISTOGRAM_BUCKETS = 5;
const MOST_ACTIVE_LIMIT = 10;
const RECENT_ACTIVITY_LIMIT = 15;

/** Truncate a string to `max` characters, appending an ellipsis when cut. */
export function truncate(s, max) {
  return s.length > max ? `${s.slice(0, max)}\u2026` : s;
}

/** Sum the `points` value of every action referenced by a participation row. */
export function sumPoints(rows, actions) {
  return rows.reduce((sum, p) => {
    const a = actions.find((x) => x.id === p.actionId);
    return sum + (a?.points || 0);
  }, 0);
}

/** Count users whose `createdAt` falls in the current calendar month. */
export function countUsersCreatedThisMonth(users) {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return users.filter((u) => u.createdAt?.startsWith(month)).length;
}

/**
 * Group participation rows by action category.
 * @returns {{ categoryData: Array<{name:string, value:number}>, topCategory: string }}
 */
export function buildCategoryData(rows, actions) {
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

/** Per-challenge summary row (one entry per non-archived challenge). */
export function buildChallengeSummary(challenges, actions, participation) {
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
export function buildComparisonData(challenges, participation, selectedChallengeIds) {
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

/** `[{name: status, value: count}]` for the donut widget. */
export function buildStatusBreakdown(challenges) {
  const counts = {};
  challenges.forEach((c) => {
    counts[c.status] = (counts[c.status] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

/** Cumulative user-growth series for the area chart, grouped by month. */
export function buildUserGrowth(users) {
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

/** Per-group participants + total points for the GroupPerformance bar chart. */
export function buildGroupPerformance(groups, users, participation, actions) {
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

/**
 * Per-challenge completion percentage (capped at 100%).
 *
 * `totalPossible = actions × max(participantCount, 1)`. The `max(_, 1)`
 * keeps brand-new challenges with no participants from dividing by zero.
 */
export function buildCompletionRates(challenges, actions, participation) {
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

/** Histogram of users bucketed by total points earned. */
export function buildPointsDistribution(participation, actions) {
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

/** Top-N users by raw action count (ties broken by insertion order). */
export function buildMostActiveUsers(participation, users) {
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

/** Most-recent participation events for the activity feed widget. */
export function buildRecentActivity(participation, users, actions, challenges) {
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
