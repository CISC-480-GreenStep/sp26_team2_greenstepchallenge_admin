const actions = [
  // ─── 2019 Commissioner's Challenge (challengeId: 1) ────────────────────
  // Kick-off tasks
  { id: 1, challengeId: 1, name: 'Complete Ecological Footprint Calculator', description: 'Calculate your ecological footprint. Leader with the smallest footprint earns the most points.', category: 'Consumption & Waste', points: 15 },
  { id: 2, challengeId: 1, name: 'Complete Water Footprint Calculator', description: 'Assess your direct and virtual water use patterns using the water calculator.', category: 'Water', points: 15 },
  { id: 3, challengeId: 1, name: 'Waste Sort Challenge', description: 'Complete a waste sort, determining which items should be recycled, composted, or trashed.', category: 'Consumption & Waste', points: 8 },
  // Daily actions (weighted points: Best=8, Good=6, Helpful=4 per day × 5 days)
  { id: 4, challengeId: 1, name: 'Meatless Day', description: 'Reduce environmental impact of food choices with less meat, namely red meat.', category: 'Food', points: 8 },
  { id: 5, challengeId: 1, name: 'Reduce Wasted Food', description: 'Save and compost food rather than throwing it in the trash.', category: 'Food', points: 6 },
  { id: 6, challengeId: 1, name: 'Use Reusable Drink Container', description: 'Avoid single-use cups — use reusable containers for beverages.', category: 'Food', points: 4 },
  { id: 7, challengeId: 1, name: 'Unplug Electronics', description: 'Unplug electronics and appliances that draw phantom power when not in use.', category: 'Energy', points: 8 },
  { id: 8, challengeId: 1, name: 'Shut Off Computer', description: 'Shut off your computer/monitor at end of day and sleep mode when away.', category: 'Energy', points: 6 },
  { id: 9, challengeId: 1, name: 'Sustainable Transportation', description: 'Avoid personal gas-powered vehicle — use transit, bike, walk, or carpool.', category: 'Transportation', points: 8 },
  { id: 10, challengeId: 1, name: 'Take the Stairs', description: 'Use the stairs instead of the elevator to reduce energy and improve health.', category: 'Transportation', points: 4 },
  { id: 11, challengeId: 1, name: 'Avoid Single-Use Plastics', description: 'No single-use food/beverage items — bring your own plates, utensils, napkins.', category: 'Consumption & Waste', points: 8 },
  { id: 12, challengeId: 1, name: 'Use Sustainable Cleaning', description: 'Use non-toxic cleaning solutions and reusable cloths instead of paper towels and chemicals.', category: 'Consumption & Waste', points: 8 },
  { id: 13, challengeId: 1, name: 'Shorter Shower / Water Off', description: 'Shower 5 minutes or less, turn off water while lathering/brushing teeth.', category: 'Water', points: 8 },
  { id: 14, challengeId: 1, name: 'Reduce Dishwashing Water', description: 'Use a dishwasher with full loads instead of hand-washing under running water.', category: 'Water', points: 6 },

  // ─── 2020 Commissioner's Challenge (challengeId: 2) ────────────────────
  { id: 15, challengeId: 2, name: 'Meatless Day', description: 'Reduce environmental impact of food choices with less meat, namely red meat.', category: 'Food', points: 8 },
  { id: 16, challengeId: 2, name: 'Reduce Wasted Food', description: 'Save leftovers, compost scraps, and reduce portion waste.', category: 'Food', points: 6 },
  { id: 17, challengeId: 2, name: 'Unplug Electronics', description: 'Disconnect devices that draw phantom power — chargers, coffee makers, desktops.', category: 'Energy', points: 8 },
  { id: 18, challengeId: 2, name: 'Shut Off Computer', description: 'Power down your workstation at end of day and sleep mode when away.', category: 'Energy', points: 6 },
  { id: 19, challengeId: 2, name: 'Sustainable Transportation', description: 'Bike, walk, carpool, or use public transit instead of driving alone.', category: 'Transportation', points: 8 },
  { id: 20, challengeId: 2, name: 'Avoid Single-Use Plastics', description: 'Eliminate single-use food and beverage items for the day.', category: 'Consumption & Waste', points: 8 },
  { id: 21, challengeId: 2, name: 'Avoid Printing', description: 'Email documents, share screens, use digital instead of printing.', category: 'Consumption & Waste', points: 4 },
  { id: 22, challengeId: 2, name: 'Shorter Shower', description: 'Reduce shower time to 5 minutes or less.', category: 'Water', points: 8 },
  { id: 23, challengeId: 2, name: 'Use Reusable Bags', description: 'Bring your own bags for shopping — avoid single-use plastic/paper bags.', category: 'Consumption & Waste', points: 6 },

  // ─── 2022 Earth Month Challenge (challengeId: 3) ───────────────────────
  // Levels-based: Good=4, Better=6, Best=8 per topic per week
  { id: 24, challengeId: 3, name: 'Water — Shorter Showers & Leak Check', description: 'Reduce weekly showering to 20 min total, complete water calculator, and check for leaks.', category: 'Water', points: 4 },
  { id: 25, challengeId: 3, name: 'Water — Reduce Toilet Flushes', description: 'All of Good level plus only flush after "number two."', category: 'Water', points: 6 },
  { id: 26, challengeId: 3, name: 'Water — Reduce Appliance Water', description: 'All of Better level plus only run dishwasher/washer when full.', category: 'Water', points: 8 },
  { id: 27, challengeId: 3, name: 'Food — Eliminate Red Meat', description: 'Reduce wasted food and eliminate red meat from your diet.', category: 'Food', points: 4 },
  { id: 28, challengeId: 3, name: 'Food — Go Vegetarian', description: 'Reduce wasted food and eliminate all meat including poultry and fish.', category: 'Food', points: 6 },
  { id: 29, challengeId: 3, name: 'Food — Go Vegan', description: 'Reduce wasted food and eliminate all animal products including dairy and eggs.', category: 'Food', points: 8 },
  { id: 30, challengeId: 3, name: 'Consumption — Single-Use Audit', description: 'Audit rooms for single-use items and swap for reusables.', category: 'Consumption & Waste', points: 4 },
  { id: 31, challengeId: 3, name: 'Consumption — Waste Log & Reuse', description: 'Keep a waste log and commit to borrowing, renting, and repairing.', category: 'Consumption & Waste', points: 6 },
  { id: 32, challengeId: 3, name: 'Consumption — Buy Nothing', description: 'Only buy necessities for the month plus waste log and audit.', category: 'Consumption & Waste', points: 8 },
  { id: 33, challengeId: 3, name: 'Energy — Cold Wash & Line Dry', description: 'Wash laundry in cold water and hang to dry, plus one energy action of choice.', category: 'Energy', points: 4 },
  { id: 34, challengeId: 3, name: 'Energy — Opt for Renewable', description: 'All of Good level plus sign up for renewable energy credits with your utility.', category: 'Energy', points: 6 },
  { id: 35, challengeId: 3, name: 'Energy — Reduce Vehicle Miles', description: 'All of Better level plus cut personal vehicle miles by half.', category: 'Energy', points: 8 },

  // ─── 2024 Earth Month Challenge (challengeId: 4) ───────────────────────
  // Daily yes/no actions, 4 points each per day
  { id: 36, challengeId: 4, name: 'Water — Skip or Short Shower', description: 'Skip a shower/bath today OR only shower for 5 minutes or less.', category: 'Water', points: 4 },
  { id: 37, challengeId: 4, name: 'Food — Plant-Based Diet', description: 'Eat a fully plant-based diet today (no red or white meat, fish, or dairy).', category: 'Food', points: 4 },
  { id: 38, challengeId: 4, name: 'Consumption — No Non-Essential Purchases', description: 'Choose not to buy any non-essential items today (essentials: food, medication, soap, toilet paper).', category: 'Consumption & Waste', points: 4 },
  { id: 39, challengeId: 4, name: 'Energy — Unplug & Power Down', description: 'Unplug electronic chargers when not in use and fully power down your workstation at end of day.', category: 'Energy', points: 4 },
  { id: 40, challengeId: 4, name: 'Transportation — No Single-Occupancy Vehicle', description: 'Walk, bike, use public transportation, or carpool instead of driving alone.', category: 'Transportation', points: 4 },

  // ─── Earth Month 2026 (challengeId: 5) ─────────────────────────────────
  { id: 41, challengeId: 5, name: 'Water Conservation', description: 'Reduce daily water usage — shorter showers, fix leaks, full loads only.', category: 'Water', points: 5 },
  { id: 42, challengeId: 5, name: 'Plant-Based Eating', description: 'Choose plant-based meals and reduce food waste.', category: 'Food', points: 5 },
  { id: 43, challengeId: 5, name: 'Reduce & Reuse', description: 'Avoid non-essential purchases, single-use items, and commit to reuse.', category: 'Consumption & Waste', points: 5 },
  { id: 44, challengeId: 5, name: 'Energy Efficiency', description: 'Unplug devices, power down workstations, and reduce home energy use.', category: 'Energy', points: 5 },
  { id: 45, challengeId: 5, name: 'Sustainable Transportation', description: 'Walk, bike, carpool, or use public transit instead of driving alone.', category: 'Transportation', points: 5 },

  // ─── Clean Commute Week (challengeId: 6) ───────────────────────────────
  { id: 46, challengeId: 6, name: 'Carpool to Work', description: 'Share a ride with one or more coworkers.', category: 'Transportation', points: 8 },
  { id: 47, challengeId: 6, name: 'Take Public Transit', description: 'Use bus or light rail for your commute.', category: 'Transportation', points: 10 },
  { id: 48, challengeId: 6, name: 'Bike to Work', description: 'Use a bicycle for your commute instead of driving.', category: 'Transportation', points: 10 },
  { id: 49, challengeId: 6, name: 'Walk to Nearby Errands', description: 'Walk instead of drive for trips under 1 mile.', category: 'Transportation', points: 5 },
  { id: 50, challengeId: 6, name: 'Plan Routes to Minimize Travel', description: 'Start your day by planning routes to minimize unnecessary or extra travel.', category: 'Transportation', points: 4 },
];

export default actions;
