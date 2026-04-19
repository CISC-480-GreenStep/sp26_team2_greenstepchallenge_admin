/**
 * Domain enums shared across the app.
 *
 * Strings here mirror the values stored in Postgres. Treat them as
 * append-only -- adding new values is safe, renaming existing ones
 * requires a migration.
 */

export const ROLES = {
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
  GENERAL_USER: "GeneralUser",
};

export const USER_STATUSES = {
  ACTIVE: "Active",
  DEACTIVATED: "Deactivated",
};

export const CHALLENGE_STATUSES = {
  ACTIVE: "Active",
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

/**
 * Action category taxonomy adopted from MPCA's GreenStep program.
 * The first item is the catch-all default.
 */
export const ACTIONS = [
  "General Sustainability",
  "Food",
  "Water",
  "Energy",
  "Transportation",
  "Consumption & Waste",
];
