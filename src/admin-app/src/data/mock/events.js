export const EVENT_STATUSES = {
  ACTIVE: 'Active',
  UPCOMING: 'Upcoming',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

export const CATEGORIES = [
  'Transportation',
  'Energy',
  'Water',
  'Waste',
  'Land Use',
  'Community',
  'General Sustainability',
];

const events = [
  { id: 1, name: 'Earth Month Challenge 2026', description: 'A month-long sustainability challenge encouraging employees to take daily green actions during April.', category: 'General Sustainability', theme: '#4CAF50', startDate: '2026-04-01', endDate: '2026-04-30', status: EVENT_STATUSES.UPCOMING, createdBy: 1, participantCount: 0, groupId: 3 },
  { id: 2, name: 'Winter Energy Saver', description: 'Track energy-saving actions at home and work during the cold months.', category: 'Energy', theme: '#2196F3', startDate: '2026-01-06', endDate: '2026-02-28', status: EVENT_STATUSES.COMPLETED, createdBy: 1, participantCount: 45, groupId: 1 },
  { id: 3, name: 'Clean Commute Week', description: 'Encourage biking, walking, carpooling, or transit for one week.', category: 'Transportation', theme: '#FF9800', startDate: '2026-03-03', endDate: '2026-03-07', status: EVENT_STATUSES.ACTIVE, createdBy: 2, participantCount: 28, groupId: 1 },
  { id: 4, name: 'Water Conservation Sprint', description: 'Two-week focus on reducing water usage with daily tips and tracking.', category: 'Water', theme: '#00BCD4', startDate: '2026-05-01', endDate: '2026-05-14', status: EVENT_STATUSES.UPCOMING, createdBy: 1, participantCount: 0, groupId: 2 },
  { id: 5, name: 'Fall Recycling Drive 2025', description: 'Agency-wide push to improve recycling habits and reduce landfill waste.', category: 'Waste', theme: '#795548', startDate: '2025-10-01', endDate: '2025-10-31', status: EVENT_STATUSES.ARCHIVED, createdBy: 1, participantCount: 62, groupId: 4 },
];

export default events;
