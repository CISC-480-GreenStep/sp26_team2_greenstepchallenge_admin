/**
 * Supabase API layer.
 * DB columns use camelCase (matching the UI), so no conversion is needed.
 */

import { supabase } from './supabase';

// ─── Constants ──────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  GENERAL_USER: 'GeneralUser',
};

export const USER_STATUSES = {
  ACTIVE: 'Active',
  DEACTIVATED: 'Deactivated',
};

export const CHALLENGE_STATUSES = {
  ACTIVE: 'Active',
  UPCOMING: 'Upcoming',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

export const ACTIONS = [
  'General Sustainability',
  'Food',
  'Water',
  'Energy',
  'Transportation',
  'Consumption & Waste',
];

/** @deprecated Use ACTIONS instead */
export const CATEGORIES = ACTIONS;

// ─── Helpers ────────────────────────────────────────
function unwrap({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// Clear old mock localStorage on first load
export function resetDemoData() {
  localStorage.removeItem('greenstep_admin_data');
}

// ─── Users ──────────────────────────────────────────
export async function getUsers() {
  return unwrap(await supabase.from('users').select('*').order('id'));
}

export async function getUserById(id) {
  return unwrap(await supabase.from('users').select('*').eq('id', id).single());
}

export async function createUser(data) {
  return unwrap(await supabase.from('users').insert(data).select().single());
}

export async function updateUser(id, data) {
  return unwrap(await supabase.from('users').update(data).eq('id', id).select().single());
}

export async function deactivateUser(id) {
  return updateUser(id, { status: USER_STATUSES.DEACTIVATED });
}

export async function activateUser(id) {
  return updateUser(id, { status: USER_STATUSES.ACTIVE });
}

// ─── Challenges ─────────────────────────────────────
export async function getChallenges() {
  const challenges = unwrap(await supabase.from('challenges').select('*').order('id'));
  const ca = unwrap(await supabase.from('challenge_actions').select('challengeId, actionId'));
  const cp = unwrap(await supabase.from('challenge_participants').select('challengeId, userId'));
  for (const c of challenges) {
    c.actionIds = ca.filter((r) => r.challengeId === c.id).map((r) => r.actionId);
    c.participants = cp.filter((r) => r.challengeId === c.id).map((r) => r.userId);
  }
  return challenges;
}

export async function getChallengeById(id) {
  const challenge = unwrap(await supabase.from('challenges').select('*').eq('id', id).single());
  if (!challenge) return null;
  const ca = unwrap(await supabase.from('challenge_actions').select('actionId').eq('challengeId', id));
  const cp = unwrap(await supabase.from('challenge_participants').select('userId').eq('challengeId', id));
  challenge.actionIds = ca.map((r) => r.actionId);
  challenge.participants = cp.map((r) => r.userId);
  return challenge;
}

export async function createChallenge(data) {
  const { actionIds, participants, ...rest } = data;
  const challenge = unwrap(await supabase.from('challenges').insert(rest).select().single());
  if (actionIds?.length) {
    await supabase.from('challenge_actions').insert(actionIds.map((aid) => ({ challengeId: challenge.id, actionId: aid })));
  }
  if (participants?.length) {
    await supabase.from('challenge_participants').insert(participants.map((uid) => ({ challengeId: challenge.id, userId: uid })));
  }
  challenge.actionIds = actionIds || [];
  challenge.participants = participants || [];
  return challenge;
}

export async function updateChallenge(id, data) {
  const { actionIds, participants, ...rest } = data;
  if (Object.keys(rest).length > 0) {
    unwrap(await supabase.from('challenges').update(rest).eq('id', id));
  }
  if (actionIds !== undefined) {
    await supabase.from('challenge_actions').delete().eq('challengeId', id);
    if (actionIds.length) {
      await supabase.from('challenge_actions').insert(actionIds.map((aid) => ({ challengeId: id, actionId: aid })));
    }
  }
  if (participants !== undefined) {
    await supabase.from('challenge_participants').delete().eq('challengeId', id);
    if (participants.length) {
      await supabase.from('challenge_participants').insert(participants.map((uid) => ({ challengeId: id, userId: uid })));
    }
  }
  return getChallengeById(id);
}

export async function archiveChallenge(id) {
  return updateChallenge(id, { status: CHALLENGE_STATUSES.ARCHIVED });
}

export async function deleteChallenge(id) {
  unwrap(await supabase.from('challenges').delete().eq('id', id));
}

// ─── Actions ────────────────────────────────────────
export async function getActions() {
  return unwrap(await supabase.from('actions').select('*').order('id'));
}

export async function getActionsByChallenge(challengeId) {
  const ca = unwrap(await supabase.from('challenge_actions').select('actionId').eq('challengeId', challengeId));
  if (!ca.length) return [];
  const actionIds = ca.map((r) => r.actionId);
  return unwrap(await supabase.from('actions').select('*').in('id', actionIds).order('id'));
}

export async function createAction(data) {
  return unwrap(await supabase.from('actions').insert(data).select().single());
}

export async function updateAction(id, data) {
  return unwrap(await supabase.from('actions').update(data).eq('id', id).select().single());
}

export async function deleteAction(id) {
  unwrap(await supabase.from('actions').delete().eq('id', id));
}

// ─── Participation ──────────────────────────────────
export async function getParticipation() {
  return unwrap(await supabase.from('participation').select('*').order('id'));
}

export async function getParticipationByChallenge(challengeId) {
  return unwrap(await supabase.from('participation').select('*').eq('challengeId', challengeId).order('id'));
}

export async function getParticipationByUser(userId) {
  return unwrap(await supabase.from('participation').select('*').eq('userId', userId).order('id'));
}

export async function getParticipantCounts() {
  const data = unwrap(await supabase.from('participation').select('challengeId, userId'));
  const counts = {};
  data.forEach((p) => {
    if (!counts[p.challengeId]) counts[p.challengeId] = new Set();
    counts[p.challengeId].add(p.userId);
  });
  return Object.fromEntries(Object.entries(counts).map(([id, set]) => [Number(id), set.size]));
}

// ─── Activity Logs ──────────────────────────────────
export async function getActivityLogsByUser(userId) {
  return unwrap(await supabase.from('activity_logs').select('*').eq('userId', userId).order('timestamp', { ascending: false }));
}

// ─── Groups / Departments ───────────────────────────
export async function getGroups() {
  return unwrap(await supabase.from('departments').select('*').order('id'));
}

export async function getGroupById(id) {
  return unwrap(await supabase.from('departments').select('*').eq('id', id).single());
}

export async function createGroup(data) {
  return unwrap(await supabase.from('departments').insert(data).select().single());
}

export async function updateGroup(id, data) {
  return unwrap(await supabase.from('departments').update(data).eq('id', id).select().single());
}

export async function deleteGroup(id) {
  unwrap(await supabase.from('departments').delete().eq('id', id));
}

// ─── Presets ─────────────────────────────────────────
export async function getPresets() {
  const presets = unwrap(await supabase.from('presets').select('*').order('id'));
  const pa = unwrap(await supabase.from('preset_actions').select('*').order('id'));
  for (const p of presets) {
    p.actions = pa.filter((a) => a.presetId === p.id);
  }
  return presets;
}

export async function getPresetById(id) {
  const preset = unwrap(await supabase.from('presets').select('*').eq('id', id).single());
  if (!preset) return null;
  preset.actions = unwrap(await supabase.from('preset_actions').select('*').eq('presetId', id).order('id'));
  return preset;
}

export async function createPreset(data) {
  const { actions: presetActions, ...rest } = data;
  const preset = unwrap(await supabase.from('presets').insert(rest).select().single());
  preset.actions = [];
  if (presetActions?.length) {
    const rows = presetActions.map((a) => ({ ...a, presetId: preset.id }));
    preset.actions = unwrap(await supabase.from('preset_actions').insert(rows).select());
  }
  return preset;
}

export async function updatePreset(id, data) {
  const { actions: presetActions, ...rest } = data;
  if (Object.keys(rest).length > 0) {
    unwrap(await supabase.from('presets').update(rest).eq('id', id));
  }
  if (presetActions !== undefined) {
    await supabase.from('preset_actions').delete().eq('presetId', id);
    if (presetActions.length) {
      const rows = presetActions.map((a) => ({ ...a, presetId: id }));
      await supabase.from('preset_actions').insert(rows);
    }
  }
  return getPresetById(id);
}

export async function deletePreset(id) {
  unwrap(await supabase.from('presets').delete().eq('id', id));
}

// ─── Templates ──────────────────────────────────────
export async function getTemplates() {
  return unwrap(await supabase.from('templates').select('*').order('id'));
}

export async function getTemplateById(id) {
  return unwrap(await supabase.from('templates').select('*').eq('id', id).single());
}

export async function createTemplate(data) {
  return unwrap(await supabase.from('templates').insert(data).select().single());
}

export async function updateTemplate(id, data) {
  return unwrap(await supabase.from('templates').update(data).eq('id', id).select().single());
}

export async function deleteTemplate(id) {
  unwrap(await supabase.from('templates').delete().eq('id', id));
}

// ─── Leaderboard helpers ────────────────────────────
export async function getLeaderboard(limit = 5) {
  const participation = unwrap(await supabase.from('participation').select('userId, actionId'));
  const actions = unwrap(await supabase.from('actions').select('id, points'));
  const users = unwrap(await supabase.from('users').select('id, name'));

  const actionPoints = Object.fromEntries(actions.map((a) => [a.id, a.points]));
  const pointsByUser = {};
  participation.forEach((p) => {
    pointsByUser[p.userId] = (pointsByUser[p.userId] || 0) + (actionPoints[p.actionId] || 0);
  });

  const userNames = Object.fromEntries(users.map((u) => [u.id, u.name]));
  return Object.entries(pointsByUser)
    .map(([userId, points]) => ({ userId: Number(userId), name: userNames[userId] || 'Unknown', points }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

export async function getUserPoints(userId) {
  const participation = unwrap(await supabase.from('participation').select('challengeId, actionId').eq('userId', userId));
  const actions = unwrap(await supabase.from('actions').select('id, points'));
  const challenges = unwrap(await supabase.from('challenges').select('id, name, status'));
  const ca = unwrap(await supabase.from('challenge_actions').select('challengeId, actionId'));

  const actionPoints = Object.fromEntries(actions.map((a) => [a.id, a.points]));
  const challengeMap = Object.fromEntries(challenges.map((c) => [c.id, c]));

  const maxPointsByChallenge = {};
  ca.forEach((r) => {
    maxPointsByChallenge[r.challengeId] = (maxPointsByChallenge[r.challengeId] || 0) + (actionPoints[r.actionId] || 0);
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

export async function getChallengeLeaderboard(challengeId, limit = 10) {
  const participation = unwrap(await supabase.from('participation').select('userId, actionId').eq('challengeId', challengeId));
  const actions = unwrap(await supabase.from('actions').select('id, points'));
  const users = unwrap(await supabase.from('users').select('id, name'));
  const ca = unwrap(await supabase.from('challenge_actions').select('actionId').eq('challengeId', challengeId));

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
    .map(([uid, d]) => ({ userId: Number(uid), name: userNames[uid] || 'Unknown', points: d.points, actionCount: d.count, maxPoints }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}
