/**
 * @file useComparisonData.js
 * @summary Pure aggregation hook for the Dashboard's Comparison Mode.
 *
 * Given the dashboard `stats` payload and the list of challenges currently
 * selected for comparison, computes the four data series the comparison
 * charts need:
 *
 *   - `barData`              total participation + points per challenge
 *   - `stackedCategoryData`  per-challenge action counts grouped by category
 *   - `categoryKeys`         distinct category names that appear above
 *   - `avgActionsData`       average actions per unique participant
 *
 * Each shape is derived from `stats.rawParticipation` and `stats.rawActions`
 * (already loaded by `useDashboardStats`), so this hook does not perform
 * any IO. The output is memoized on the inputs so React only re-renders
 * the chart subtree when the underlying data actually changes.
 */

import { useMemo } from "react";

/** Sum of points awarded for a list of participation rows. */
function sumPoints(participation, actions) {
  let total = 0;
  participation.forEach((p) => {
    const action = actions ? actions.find((a) => a.id === p.actionId) : null;
    if (action) total += action.points;
  });
  return total;
}

/** Append "(Upcoming)" to challenge names that haven't started yet. */
function displayName(challenge) {
  return challenge.status === "Upcoming" ? `${challenge.name} (Upcoming)` : challenge.name;
}

/**
 * @param {object} stats - The aggregated dashboard stats from `useDashboardStats`.
 * @param {object[]} selectedChallenges - Challenges currently selected for comparison.
 * @returns {{
 *   barData: { name: string, participation: number, points: number }[],
 *   stackedCategoryData: object[],
 *   categoryKeys: string[],
 *   avgActionsData: { name: string, averageActions: number }[],
 * }}
 */
export function useComparisonData(stats, selectedChallenges) {
  return useMemo(() => {
    const rawParticipation = stats.rawParticipation || [];
    const rawActions = stats.rawActions || [];

    const barData = selectedChallenges.map((c) => {
      const cPart = rawParticipation.filter((p) => p.challengeId === c.id);
      return {
        name: displayName(c),
        participation: cPart.length,
        points: sumPoints(cPart, rawActions),
      };
    });

    // Build per-challenge category breakdown rows AND the union of category
    // names in one pass so the chart can render a fixed set of stacked bars.
    const categoryKeysSet = new Set();
    const stackedCategoryData = selectedChallenges.map((c) => {
      const cPart = rawParticipation.filter((p) => p.challengeId === c.id);
      const catCounts = {};
      cPart.forEach((p) => {
        const action = rawActions.find((a) => a.id === p.actionId);
        if (action && action.category) {
          catCounts[action.category] = (catCounts[action.category] || 0) + 1;
          categoryKeysSet.add(action.category);
        }
      });
      return { challengeName: c.name, ...catCounts };
    });
    const categoryKeys = Array.from(categoryKeysSet);

    const avgActionsData = selectedChallenges.map((c) => {
      const cPart = rawParticipation.filter((p) => p.challengeId === c.id);
      const uniqueUsers = new Set(cPart.map((p) => p.userId)).size;
      const averageActions =
        uniqueUsers > 0 ? Number((cPart.length / uniqueUsers).toFixed(1)) : 0;
      return { name: displayName(c), averageActions };
    });

    return { barData, stackedCategoryData, categoryKeys, avgActionsData };
  }, [stats, selectedChallenges]);
}
