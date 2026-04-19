/**
 * @file challenges.js
 * @summary Challenges API -- read/write the `challenges` table plus its
 * `challenge_actions` and `challenge_participants` join tables.
 *
 * Every read flattens the join rows back onto the parent challenge as
 * `actionIds: number[]` and `participants: number[]` so callers don't
 * have to know the join shape exists.
 */

import { supabase } from "../supabase";
import { CHALLENGE_STATUSES } from "./constants";
import { unwrap } from "./helpers";

/**
 * Fetch every challenge with its action and participant id arrays joined in.
 * @returns {Promise<Array<object>>}
 */
export async function getChallenges() {
  const challenges = unwrap(await supabase.from("challenges").select("*").order("id"));
  const ca = unwrap(await supabase.from("challenge_actions").select("challengeId, actionId"));
  const cp = unwrap(await supabase.from("challenge_participants").select("challengeId, userId"));
  for (const c of challenges) {
    c.actionIds = ca.filter((r) => r.challengeId === c.id).map((r) => r.actionId);
    c.participants = cp.filter((r) => r.challengeId === c.id).map((r) => r.userId);
  }
  return challenges;
}

/**
 * Fetch one challenge by id with its joined arrays.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export async function getChallengeById(id) {
  const challenge = unwrap(await supabase.from("challenges").select("*").eq("id", id).single());
  if (!challenge) return null;
  const ca = unwrap(
    await supabase.from("challenge_actions").select("actionId").eq("challengeId", id),
  );
  const cp = unwrap(
    await supabase.from("challenge_participants").select("userId").eq("challengeId", id),
  );
  challenge.actionIds = ca.map((r) => r.actionId);
  challenge.participants = cp.map((r) => r.userId);
  return challenge;
}

/**
 * Create a challenge plus its join rows in one call.
 *
 * @param {object} data Challenge fields plus optional `actionIds[]` and `participants[]`.
 * @returns {Promise<object>} The new challenge with its joined arrays.
 */
export async function createChallenge(data) {
  const { actionIds, participants, ...rest } = data;
  const challenge = unwrap(await supabase.from("challenges").insert(rest).select().single());
  if (actionIds?.length) {
    await supabase
      .from("challenge_actions")
      .insert(actionIds.map((aid) => ({ challengeId: challenge.id, actionId: aid })));
  }
  if (participants?.length) {
    await supabase
      .from("challenge_participants")
      .insert(participants.map((uid) => ({ challengeId: challenge.id, userId: uid })));
  }
  challenge.actionIds = actionIds || [];
  challenge.participants = participants || [];
  return challenge;
}

/**
 * Patch a challenge row and (optionally) replace its join rows.
 *
 * Passing `actionIds: undefined` leaves the join untouched; passing an
 * empty array clears it. Same for `participants`.
 *
 * @param {number|string} id
 * @param {object} data Partial fields plus optional `actionIds`/`participants`.
 * @returns {Promise<object>} The refreshed challenge with joins.
 */
export async function updateChallenge(id, data) {
  const { actionIds, participants, ...rest } = data;
  if (Object.keys(rest).length > 0) {
    unwrap(await supabase.from("challenges").update(rest).eq("id", id));
  }
  if (actionIds !== undefined) {
    await supabase.from("challenge_actions").delete().eq("challengeId", id);
    if (actionIds.length) {
      await supabase
        .from("challenge_actions")
        .insert(actionIds.map((aid) => ({ challengeId: id, actionId: aid })));
    }
  }
  if (participants !== undefined) {
    await supabase.from("challenge_participants").delete().eq("challengeId", id);
    if (participants.length) {
      await supabase
        .from("challenge_participants")
        .insert(participants.map((uid) => ({ challengeId: id, userId: uid })));
    }
  }
  return getChallengeById(id);
}

/**
 * Convenience wrapper -- flips a challenge to Archived status without
 * touching its join rows. Preferred over deletion so reports keep working.
 * @param {number|string} id
 */
export async function archiveChallenge(id) {
  return updateChallenge(id, { status: CHALLENGE_STATUSES.ARCHIVED });
}

/**
 * Hard-delete a challenge. Cascades on the join tables via FK ON DELETE.
 * @param {number|string} id
 */
export async function deleteChallenge(id) {
  unwrap(await supabase.from("challenges").delete().eq("id", id));
}
