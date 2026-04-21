/**
 * @file participation.js
 * @summary Participation API -- read the `participation` table.
 *
 * One row per (user, challenge, action) completion event. There are no
 * write helpers here yet because the admin console only reads
 * participation; users on the mobile app are the producers.
 */

import { supabase } from "../supabase";
import { unwrap } from "./helpers";

/**
 * Fetch every participation row, ordered by id.
 * @returns {Promise<Array<object>>}
 */
export async function getParticipation() {
  return unwrap(await supabase.from("participation").select("*").order("id"));
}

/**
 * Fetch participation rows for a single challenge.
 * @param {number|string} challengeId
 * @returns {Promise<Array<object>>}
 */
export async function getParticipationByChallenge(challengeId) {
  return unwrap(
    await supabase.from("participation").select("*").eq("challengeId", challengeId).order("id"),
  );
}

/**
 * Fetch participation rows for a single user.
 * @param {number|string} userId
 * @returns {Promise<Array<object>>}
 */
export async function getParticipationByUser(userId) {
  return unwrap(await supabase.from("participation").select("*").eq("userId", userId).order("id"));
}

/**
 * Compute distinct participant count per challenge.
 *
 * Returned as a `{ [challengeId]: count }` map -- using a Set during
 * aggregation guarantees we count distinct users even when one user
 * logs many actions for the same challenge.
 *
 * @returns {Promise<Record<number, number>>}
 */
export async function getParticipantCounts() {
  const data = unwrap(await supabase.from("participation").select("challengeId, userId"));
  const counts = {};
  data.forEach((p) => {
    if (!counts[p.challengeId]) counts[p.challengeId] = new Set();
    counts[p.challengeId].add(p.userId);
  });
  return Object.fromEntries(Object.entries(counts).map(([id, set]) => [Number(id), set.size]));
}
