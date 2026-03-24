/**
 * Centralized permission rules for the admin console.
 * Change these values to adjust who can see and do what.
 * Role hierarchy: GeneralUser < Admin < SuperAdmin
 */

import { ROLES } from '../data/api';

const ROLE_ORDER = { [ROLES.GENERAL_USER]: 0, [ROLES.ADMIN]: 1, [ROLES.SUPER_ADMIN]: 2 };

function atLeast(role, minRole) {
  return ROLE_ORDER[role] >= ROLE_ORDER[minRole];
}

/**
 * Permission configuration.
 * Set minRole to ROLES.GENERAL_USER to allow all logged-in users.
 * Set to ROLES.ADMIN or ROLES.SUPER_ADMIN to restrict.
 */
export const PERMS = {
  // ─── Users ─────────────────────────────────────────────────────────
  /** Who can access the Users list page */
  VIEW_USERS_LIST: ROLES.GENERAL_USER,

  /** Who can view a specific user's detail page (all users in list are clickable) */
  VIEW_USER_DETAIL: ROLES.GENERAL_USER,

  /** Who can see which users in the list (for future: filter by group, etc.) */
  VIEW_USER_IN_LIST: ROLES.GENERAL_USER,

  /** Who can see user email on list and detail */
  VIEW_USER_EMAIL: ROLES.GENERAL_USER,

  /** Who can see user role on list and detail */
  VIEW_USER_ROLE: ROLES.GENERAL_USER,

  /** Who can see user group on list and detail */
  VIEW_USER_GROUP: ROLES.GENERAL_USER,

  /** Who can see user status (Active/Deactivated) */
  VIEW_USER_STATUS: ROLES.GENERAL_USER,

  /** Who can see Last Active on user list */
  VIEW_USER_LAST_ACTIVE: ROLES.GENERAL_USER,

  /** Who can see a user's Activity Log (admin actions) */
  VIEW_USER_ACTIVITY_LOG: ROLES.GENERAL_USER,

  /** Who can see a user's Participation (sustainability actions completed) */
  VIEW_USER_PARTICIPATION: ROLES.GENERAL_USER,

  /** Who can see a user's Points (global and per-challenge) */
  VIEW_USER_POINTS: ROLES.GENERAL_USER,

  /** Who can create new users */
  CREATE_USER: ROLES.SUPER_ADMIN,

  /** Who can edit user (name, email, role, status, group) */
  EDIT_USER: ROLES.ADMIN,

  /** Who can change a user's group from the detail page */
  CHANGE_USER_GROUP: ROLES.ADMIN,

  /** Who can activate/deactivate users */
  ACTIVATE_DEACTIVATE_USER: ROLES.ADMIN,

  /** Who can permanently delete users */
  DELETE_USER: ROLES.SUPER_ADMIN,

  // ─── Future: scope to specific users (e.g. GeneralUser sees only same group) ───
  // When needed, add: canViewUser(userId, viewerUserId, viewerRole, viewerGroupId)
  // and filter the users list / block detail access accordingly.
};

/**
 * Check if a role has permission for a given action.
 * @param {string} userRole - The logged-in user's role
 * @param {string} perm - Key from PERMS (e.g. 'VIEW_USER_EMAIL')
 * @returns {boolean}
 */
export function can(userRole, perm) {
  const minRole = PERMS[perm];
  if (!minRole) return false;
  return atLeast(userRole, minRole);
}
