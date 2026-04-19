const groups = [
  {
    id: 1,
    name: "MPCA Staff",
    description: "Minnesota Pollution Control Agency employees",
    createdAt: "2025-09-01",
  },
  {
    id: 2,
    name: "DNR Team",
    description: "Department of Natural Resources staff",
    createdAt: "2025-10-15",
  },
  {
    id: 3,
    name: "April 2026 Cohort",
    description: "Participants in the April 2026 sustainability push",
    createdAt: "2026-02-01",
  },
  {
    id: 4,
    name: "Building A",
    description: "Employees in Building A campus",
    createdAt: "2026-01-10",
  },
];

/** @deprecated Use departments instead */
export default groups;

export const departments = groups;
