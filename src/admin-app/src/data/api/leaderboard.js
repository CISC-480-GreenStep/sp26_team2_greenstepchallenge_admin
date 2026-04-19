/**
 * @file leaderboard.js
 * @summary Leaderboard / points-aggregation queries.
 *
 * These functions cross multiple tables (participation + actions +
 * users + challenges) so they don't fit cleanly under any single entity
 * module. Putting them together here keeps the join logic in one place.
 *
 * All math happens client-side after a few small selects -- adequate at
 * the current data volumes; revisit with a SQL view or RPC if a
 * widget-driven dashboard makes this hot.
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

/**
 * Top-N global leaderboard across all challenges.
 *
 * @param {number} [limit=5]
 * @returns {Promise<Array<{ userId: number, name: string, points: number }>>}
 */
export async function getLeaderboard(limit = 5) {
  const participation = unwrap(await supabase.from("participation").select("userId, actionId"));
  const actions = unwrap(await supabase.from("actions").select("id, points"));
  const users = unwrap(await supabase.from("users").select("id, name"));

  const actionPoints = Object.fromEntries(actions.map((a) => [a.id, a.points]));
  const pointsByUser = {};
  participation.forEach((p) => {
    pointsByUser[p.userId] = (pointsByUser[p.userId] || 0) + (actionPoints[p.actionId] || 0);
  });

  const userNames = Object.fromEntries(users.map((u) => [u.id, u.name]));
  return Object.entries(pointsByUser)
    .map(([userId, points]) => ({
      userId: Number(userId),
      name: userNames[userId] || "Unknown",
      points,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

/**
 * Per-user points breakdown across every challenge they've touched.
 *
 * Returns both a global total and a `breakdown[]` array of one entry
 * per challenge with `points` (earned), `maxPoints` (achievable), and
 * `count` (action completions). Used by UserDetail's points-history
 * progress bars.
 *
 * @param {number|string} userId
 * @returns {Promise<{ total: number, breakdown: Array<object> }>}
 */
export async function getUserPoints(userId) {
  const participation = unwrap(
    await supabase.from("participation").select("challengeId, actionId").eq("userId", userId),
  );
  const actions = unwrap(await supabase.from("actions").select("id, points"));
  const challenges = unwrap(await supabase.from("challenges").select("id, name, status"));
  const ca = unwrap(await supabase.from("challenge_actions").select("challengeId, actionId"));

  const actionPoints = Object.fromEntries(actions.map((a) => [a.id, a.points]));
  const challengeMap = Object.fromEntries(challenges.map((c) => [c.id, c]));

  const maxPointsByChallenge = {};
  ca.forEach((r) => {
    maxPointsByChallenge[r.challengeId] =
      (maxPointsByChallenge[r.challengeId] || 0) + (actionPoints[r.actionId] || 0);
  });

  const byChallenge = {};
  participation.forEach((p) => {
    const pts = actionPoints[p.actionId] || 0;
    const c = challengeMap[p.challengeId];
    if (!c) return;
    if (!byChallenge[c.id]) {
      byChallenge[c.id] = {
        challengeId: c.id,
        challengeName: c.name,
        status: c.status,
        points: 0,
        maxPoints: maxPointsByChallenge[c.id] || 0,
        count: 0,
      };
    }
    byChallenge[c.id].points += pts;
    byChallenge[c.id].count += 1;
  });

  const breakdown = Object.values(byChallenge);
  const total = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { total, breakdown };
}

/**
 * Per-challenge leaderboard with `maxPoints` so the UI can render
 * progress bars relative to the challenge's ceiling.
 *
 * @param {number|string} challengeId
 * @param {number} [limit=10]
 * @returns {Promise<Array<{ userId: number, name: string, points: number, actionCount: number, maxPoints: number }>>}
 */
export async function getChallengeLeaderboard(challengeId, limit = 10) {
  const participation = unwrap(
    await supabase.from("participation").select("userId, actionId").eq("challengeId", challengeId),
  );
  const actions = unwrap(await supabase.from("actions").select("id, points"));
  const users = unwrap(await supabase.from("users").select("id, name"));
  const ca = unwrap(
    await supabase.from("challenge_actions").select("actionId").eq("challengeId", challengeId),
  );

  const actionPoints = Object.fromEntries(actions.map((a) => [a.id, a.points]));
  const userNames = Object.fromEntries(users.map((u) => [u.id, u.name]));
  const maxPoints = ca.reduce((sum, r) => sum + (actionPoints[r.actionId] || 0), 0);

  const pointsByUser = {};
  participation.forEach((p) => {
    if (!pointsByUser[p.userId]) pointsByUser[p.userId] = { points: 0, count: 0 };
    pointsByUser[p.userId].points += actionPoints[p.actionId] || 0;
    pointsByUser[p.userId].count += 1;
  });

  return Object.entries(pointsByUser)
    .map(([uid, d]) => ({
      userId: Number(uid),
      name: userNames[uid] || "Unknown",
      points: d.points,
      actionCount: d.count,
      maxPoints,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}
