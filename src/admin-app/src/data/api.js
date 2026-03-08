/**
 * Mock API layer with localStorage persistence.
 * Each function returns a Promise so the rest of the app can treat it exactly
 * like a real fetch() call. When the backend is ready, swap these
 * implementations for real HTTP requests.
 */

import usersData, { ROLES, USER_STATUSES } from './mock/users';
import eventsData, { EVENT_STATUSES, CATEGORIES } from './mock/events';
import actionsData from './mock/actions';
import participationData from './mock/participation';
import activityLogsData from './mock/activityLogs';
import groupsData from './mock/groups';
import presetsData from './mock/presets';

const STORAGE_KEY = 'greenstep_admin_data';
/** Bump when mock data structure/content changes; old stored data will be discarded */
const DATA_VERSION = 3;

function loadDefaults() {
  return {
    _version: DATA_VERSION,
    users: [...usersData],
    events: [...eventsData],
    actions: [...actionsData],
    participation: [...participationData],
    activityLogs: [...activityLogsData],
    groups: [...groupsData],
    presets: presetsData.map((p) => ({ ...p, actions: [...p.actions] })),
    nextIds: {
      user: usersData.length + 1,
      event: eventsData.length + 1,
      action: actionsData.length + 1,
      group: groupsData.length + 1,
      preset: presetsData.length + 1,
    },
  };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : null;
    if (stored && stored._version >= DATA_VERSION) {
      return stored;
    }
  } catch { /* ignore corrupt data */ }
  return null;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

let store = loadFromStorage() || loadDefaults();

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  store = loadDefaults();
}

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

// ─── Users ──────────────────────────────────────────
export async function getUsers() {
  await delay();
  return [...store.users];
}

export async function getUserById(id) {
  await delay();
  return store.users.find((u) => u.id === id) || null;
}

export async function createUser(data) {
  await delay();
  const user = { id: store.nextIds.user++, createdAt: new Date().toISOString().slice(0, 10), lastActive: null, ...data };
  store.users.push(user);
  save();
  return user;
}

export async function updateUser(id, data) {
  await delay();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found');
  store.users[idx] = { ...store.users[idx], ...data };
  save();
  return store.users[idx];
}

export async function deactivateUser(id) {
  return updateUser(id, { status: USER_STATUSES.DEACTIVATED });
}

export async function activateUser(id) {
  return updateUser(id, { status: USER_STATUSES.ACTIVE });
}

// ─── Events (Challenges) ───────────────────────────
export async function getEvents() {
  await delay();
  return [...store.events];
}

export async function getEventById(id) {
  await delay();
  return store.events.find((e) => e.id === id) || null;
}

export async function createEvent(data) {
  await delay();
  const event = { id: store.nextIds.event++, participantCount: 0, ...data };
  store.events.push(event);
  save();
  return event;
}

export async function updateEvent(id, data) {
  await delay();
  const idx = store.events.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error('Event not found');
  store.events[idx] = { ...store.events[idx], ...data };
  save();
  return store.events[idx];
}

export async function archiveEvent(id) {
  return updateEvent(id, { status: EVENT_STATUSES.ARCHIVED });
}

export async function deleteEvent(id) {
  await delay();
  store.events = store.events.filter((e) => e.id !== id);
  save();
}

// ─── Actions ────────────────────────────────────────
export async function getActions() {
  await delay();
  return [...store.actions];
}

export async function getActionsByEvent(eventId) {
  await delay();
  return store.actions.filter((a) => a.eventId === eventId);
}

export async function createAction(data) {
  await delay();
  const action = { id: store.nextIds.action++, ...data };
  store.actions.push(action);
  save();
  return action;
}

export async function updateAction(id, data) {
  await delay();
  const idx = store.actions.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('Action not found');
  store.actions[idx] = { ...store.actions[idx], ...data };
  save();
  return store.actions[idx];
}

export async function deleteAction(id) {
  await delay();
  store.actions = store.actions.filter((a) => a.id !== id);
  save();
}

// ─── Participation ──────────────────────────────────
export async function getParticipation() {
  await delay();
  return [...store.participation];
}

export async function getParticipationByEvent(eventId) {
  await delay();
  return store.participation.filter((p) => p.eventId === eventId);
}

export async function getParticipationByUser(userId) {
  await delay();
  return store.participation.filter((p) => p.userId === userId);
}

export async function getParticipantCountByEvent(eventId) {
  await delay();
  const unique = new Set(store.participation.filter((p) => p.eventId === eventId).map((p) => p.userId));
  return unique.size;
}

/** Returns { eventId: participantCount } for all events */
export async function getParticipantCountsByEvents() {
  await delay();
  const counts = {};
  store.participation.forEach((p) => {
    if (!counts[p.eventId]) counts[p.eventId] = new Set();
    counts[p.eventId].add(p.userId);
  });
  return Object.fromEntries(Object.entries(counts).map(([id, set]) => [Number(id), set.size]));
}

// ─── Activity Logs ──────────────────────────────────
export async function getActivityLogs() {
  await delay();
  return [...store.activityLogs];
}

export async function getActivityLogsByUser(userId) {
  await delay();
  return store.activityLogs.filter((l) => l.userId === userId);
}

// ─── Groups ─────────────────────────────────────────
export async function getGroups() {
  await delay();
  return [...store.groups];
}

export async function getGroupById(id) {
  await delay();
  return store.groups.find((g) => g.id === id) || null;
}

export async function createGroup(data) {
  await delay();
  const group = { id: store.nextIds.group++, createdAt: new Date().toISOString().slice(0, 10), ...data };
  store.groups.push(group);
  save();
  return group;
}

export async function updateGroup(id, data) {
  await delay();
  const idx = store.groups.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error('Group not found');
  store.groups[idx] = { ...store.groups[idx], ...data };
  save();
  return store.groups[idx];
}

export async function deleteGroup(id) {
  await delay();
  store.groups = store.groups.filter((g) => g.id !== id);
  save();
}

// ─── Presets ─────────────────────────────────────────
export async function getPresets() {
  await delay();
  return store.presets.map((p) => ({ ...p, actions: [...p.actions] }));
}

export async function getPresetById(id) {
  await delay();
  const p = store.presets.find((p) => p.id === id);
  return p ? { ...p, actions: [...p.actions] } : null;
}

export async function createPreset(data) {
  await delay();
  const preset = { id: store.nextIds.preset++, createdAt: new Date().toISOString().slice(0, 10), actions: [], ...data };
  store.presets.push(preset);
  save();
  return { ...preset, actions: [...preset.actions] };
}

export async function updatePreset(id, data) {
  await delay();
  const idx = store.presets.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('Preset not found');
  store.presets[idx] = { ...store.presets[idx], ...data };
  save();
  return { ...store.presets[idx], actions: [...store.presets[idx].actions] };
}

export async function deletePreset(id) {
  await delay();
  store.presets = store.presets.filter((p) => p.id !== id);
  save();
}

// ─── Leaderboard helper ─────────────────────────────
export async function getLeaderboard(limit = 5) {
  await delay();
  const pointsByUser = {};
  store.participation.forEach((p) => {
    const action = store.actions.find((a) => a.id === p.actionId);
    if (action) {
      pointsByUser[p.userId] = (pointsByUser[p.userId] || 0) + action.points;
    }
  });
  return Object.entries(pointsByUser)
    .map(([userId, points]) => {
      const user = store.users.find((u) => u.id === Number(userId));
      return { userId: Number(userId), name: user?.name || 'Unknown', points };
    })
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

export async function getUserPoints(userId) {
  await delay();
  const byChallenge = {};
  store.participation
    .filter((p) => p.userId === userId)
    .forEach((p) => {
      const action = store.actions.find((a) => a.id === p.actionId);
      const event = store.events.find((e) => e.id === p.eventId);
      if (action && event) {
        if (!byChallenge[event.id]) {
          const maxPoints = store.actions
            .filter((a) => a.eventId === event.id)
            .reduce((sum, a) => sum + a.points, 0);
          byChallenge[event.id] = {
            challengeId: event.id,
            challengeName: event.name,
            status: event.status,
            points: 0,
            maxPoints,
            count: 0,
          };
        }
        byChallenge[event.id].points += action.points;
        byChallenge[event.id].count += 1;
      }
    });
  const breakdown = Object.values(byChallenge);
  const total = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { total, breakdown };
}

export async function getChallengeLeaderboard(eventId, limit = 10) {
  await delay();
  const pointsByUser = {};
  store.participation
    .filter((p) => p.eventId === eventId)
    .forEach((p) => {
      const action = store.actions.find((a) => a.id === p.actionId);
      if (action) {
        if (!pointsByUser[p.userId]) pointsByUser[p.userId] = { points: 0, count: 0 };
        pointsByUser[p.userId].points += action.points;
        pointsByUser[p.userId].count += 1;
      }
    });
  const maxPoints = store.actions
    .filter((a) => a.eventId === eventId)
    .reduce((sum, a) => sum + a.points, 0);
  return Object.entries(pointsByUser)
    .map(([uid, data]) => {
      const user = store.users.find((u) => u.id === Number(uid));
      return { userId: Number(uid), name: user?.name || 'Unknown', points: data.points, actionCount: data.count, maxPoints };
    })
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

// ─── Re-exports for convenience ─────────────────────
export { ROLES, USER_STATUSES, EVENT_STATUSES, CATEGORIES };
