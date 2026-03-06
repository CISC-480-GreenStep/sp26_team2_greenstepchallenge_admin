export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  GENERAL_USER: 'GeneralUser',
};

export const USER_STATUSES = {
  ACTIVE: 'Active',
  DEACTIVATED: 'Deactivated',
};

const users = [
  { id: 1, name: 'Kristin Mroz-Risse', email: 'kristin.mroz@mpca.mn.gov', role: ROLES.SUPER_ADMIN, status: USER_STATUSES.ACTIVE, groupId: 1, createdAt: '2025-09-01', lastActive: '2026-03-04' },
  { id: 2, name: 'Eli Goldberger', email: 'eli.goldberger@example.com', role: ROLES.ADMIN, status: USER_STATUSES.ACTIVE, groupId: 1, createdAt: '2026-01-15', lastActive: '2026-03-05' },
  { id: 3, name: 'Khue Vo', email: 'khue.vo@example.com', role: ROLES.ADMIN, status: USER_STATUSES.ACTIVE, groupId: 1, createdAt: '2026-01-15', lastActive: '2026-03-04' },
  { id: 4, name: 'Rudy Vergara', email: 'rudy.vergara@example.com', role: ROLES.ADMIN, status: USER_STATUSES.ACTIVE, groupId: 1, createdAt: '2026-01-15', lastActive: '2026-03-03' },
  { id: 5, name: 'Sarah Johnson', email: 'sarah.johnson@mpca.mn.gov', role: ROLES.GENERAL_USER, status: USER_STATUSES.ACTIVE, groupId: 1, createdAt: '2026-02-01', lastActive: '2026-03-02' },
  { id: 6, name: 'Mike Chen', email: 'mike.chen@mpca.mn.gov', role: ROLES.GENERAL_USER, status: USER_STATUSES.ACTIVE, groupId: 2, createdAt: '2026-02-10', lastActive: '2026-03-01' },
  { id: 7, name: 'Lisa Park', email: 'lisa.park@example.com', role: ROLES.GENERAL_USER, status: USER_STATUSES.DEACTIVATED, groupId: 4, createdAt: '2025-11-05', lastActive: '2026-01-20' },
  { id: 8, name: 'James Williams', email: 'james.w@mpca.mn.gov', role: ROLES.GENERAL_USER, status: USER_STATUSES.ACTIVE, groupId: 2, createdAt: '2026-02-15', lastActive: '2026-03-04' },
];

export default users;
