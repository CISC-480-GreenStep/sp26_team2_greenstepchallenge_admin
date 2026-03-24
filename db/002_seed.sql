-- GreenStep Sustainability Challenge - Seed Data

-- ============================================================
-- USER ROLES
-- ============================================================
INSERT INTO user_roles (id, role_type) VALUES
  (1, 'SuperAdmin'),
  (2, 'Admin'),
  (3, 'GeneralUser');

SELECT setval('user_roles_id_seq', 3);

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (id, name, description) VALUES
  (1, 'General Sustainability', 'Broad sustainability actions spanning multiple focus areas.'),
  (2, 'Food',                   'Actions related to sustainable eating, reducing food waste, and plant-based diets.'),
  (3, 'Water',                  'Actions focused on water conservation and reducing water waste.'),
  (4, 'Energy',                 'Actions to reduce energy consumption and promote renewable energy.'),
  (5, 'Transportation',         'Actions encouraging sustainable commuting and reducing vehicle emissions.'),
  (6, 'Consumption & Waste',    'Actions to reduce, reuse, and recycle consumer goods and waste.');

SELECT setval('categories_id_seq', 6);

-- ============================================================
-- USERS
-- ============================================================
INSERT INTO users (id, first_name, last_name, email, username, password_hash, role_id, status, date_joined, last_active) VALUES
  (1,  'Kristin', 'Mroz-Risse', 'kristin.mroz@mpca.mn.gov',  'kristin.mroz',     '$placeholder_hash$', 1, 'Active',      '2018-06-01', '2026-03-04'),
  (2,  'Eli',     'Goldberger',  'eli.goldberger@example.com', 'eli.goldberger',   '$placeholder_hash$', 2, 'Active',      '2026-01-15', '2026-03-05'),
  (3,  'Khue',    'Vo',          'khue.vo@example.com',        'khue.vo',          '$placeholder_hash$', 2, 'Active',      '2026-01-15', '2026-03-04'),
  (4,  'Rudy',    'Vergara',     'rudy.vergara@example.com',   'rudy.vergara',     '$placeholder_hash$', 2, 'Active',      '2026-01-15', '2026-03-03'),
  (5,  'Sarah',   'Johnson',     'sarah.johnson@mpca.mn.gov',  'sarah.johnson',    '$placeholder_hash$', 3, 'Active',      '2019-01-10', '2026-03-02'),
  (6,  'Mike',    'Chen',        'mike.chen@mpca.mn.gov',      'mike.chen',        '$placeholder_hash$', 3, 'Active',      '2019-01-10', '2026-03-01'),
  (7,  'Lisa',    'Park',        'lisa.park@mpca.mn.gov',      'lisa.park',        '$placeholder_hash$', 3, 'Deactivated', '2019-01-10', '2024-05-01'),
  (8,  'James',   'Williams',    'james.w@mpca.mn.gov',        'james.williams',   '$placeholder_hash$', 3, 'Active',      '2020-01-08', '2026-03-04'),
  (9,  'Carla',   'Martinez',    'carla.martinez@mpca.mn.gov', 'carla.martinez',   '$placeholder_hash$', 3, 'Active',      '2022-03-15', '2026-03-03'),
  (10, 'David',   'Nguyen',      'david.nguyen@mpca.mn.gov',   'david.nguyen',     '$placeholder_hash$', 3, 'Active',      '2019-01-10', '2026-02-28'),
  (11, 'Emily',   'Olson',       'emily.olson@mpca.mn.gov',    'emily.olson',      '$placeholder_hash$', 3, 'Active',      '2022-03-20', '2026-03-01'),
  (12, 'Tom',     'Anderson',    'tom.anderson@mpca.mn.gov',   'tom.anderson',     '$placeholder_hash$', 3, 'Active',      '2020-01-08', '2026-02-25');

SELECT setval('users_id_seq', 12);

-- ============================================================
-- CHALLENGES
-- ============================================================
INSERT INTO challenges (id, name, description, event_type, category_id, theme, start_date, end_date, start_time, end_time, status, created_by, participant_count) VALUES
  (1, '2019 Commissioner''s Sustainability Challenge',
      'A week-long challenge where MPCA employees tracked daily sustainability actions across food, energy, mobility, goods/services, and water categories with weighted point scoring.',
      'Weekly', 1, '#4CAF50', '2019-01-14', '2019-01-18', '08:00', '17:00', 'Archived', 1, 34),
  (2, '2020 Commissioner''s Sustainability Challenge',
      'Second annual week-long challenge with the same daily action tracking format, focusing on reducing environmental impact through everyday choices.',
      'Weekly', 1, '#2196F3', '2020-01-13', '2020-01-17', '08:00', '17:00', 'Archived', 1, 41),
  (3, '2022 Earth Month Sustainability Challenge',
      'Month-long April challenge with tiered difficulty levels (Good, Better, Best) across Water, Food, Consumption & Waste, and Energy categories.',
      'Monthly', 1, '#FF9800', '2022-04-04', '2022-04-29', NULL, NULL, 'Archived', 1, 52),
  (4, '2024 Earth Month Sustainability Challenge',
      'Month-long April challenge with five daily yes/no sustainability actions: Water, Food, Consumption, Energy, and Transportation.',
      'Monthly', 1, '#00BCD4', '2024-04-01', '2024-04-28', NULL, NULL, 'Completed', 1, 38),
  (5, 'Earth Month Challenge 2026',
      'Upcoming month-long sustainability challenge for April 2026. Actions and scoring are being designed based on feedback from prior years.',
      'Monthly', 1, '#9C27B0', '2026-04-01', '2026-04-30', NULL, NULL, 'Upcoming', 1, 0),
  (6, 'Clean Commute Week',
      'One-week challenge encouraging biking, walking, carpooling, or transit for daily commutes.',
      'Weekly', 5, '#795548', '2026-03-03', '2026-03-07', '06:00', '19:00', 'Active', 2, 28);

SELECT setval('challenges_id_seq', 6);

-- ============================================================
-- ACTIONS
-- ============================================================
INSERT INTO actions (id, challenge_id, name, description, category_id, points) VALUES
  -- 2019 Commissioner's Challenge (challenge 1)
  (1,  1, 'Complete Ecological Footprint Calculator', 'Calculate your ecological footprint. Leader with the smallest footprint earns the most points.', 6, 15),
  (2,  1, 'Complete Water Footprint Calculator', 'Assess your direct and virtual water use patterns using the water calculator.', 3, 15),
  (3,  1, 'Waste Sort Challenge', 'Complete a waste sort, determining which items should be recycled, composted, or trashed.', 6, 8),
  (4,  1, 'Meatless Day', 'Reduce environmental impact of food choices with less meat, namely red meat.', 2, 8),
  (5,  1, 'Reduce Wasted Food', 'Save and compost food rather than throwing it in the trash.', 2, 6),
  (6,  1, 'Use Reusable Drink Container', 'Avoid single-use cups — use reusable containers for beverages.', 2, 4),
  (7,  1, 'Unplug Electronics', 'Unplug electronics and appliances that draw phantom power when not in use.', 4, 8),
  (8,  1, 'Shut Off Computer', 'Shut off your computer/monitor at end of day and sleep mode when away.', 4, 6),
  (9,  1, 'Sustainable Transportation', 'Avoid personal gas-powered vehicle — use transit, bike, walk, or carpool.', 5, 8),
  (10, 1, 'Take the Stairs', 'Use the stairs instead of the elevator to reduce energy and improve health.', 5, 4),
  (11, 1, 'Avoid Single-Use Plastics', 'No single-use food/beverage items — bring your own plates, utensils, napkins.', 6, 8),
  (12, 1, 'Use Sustainable Cleaning', 'Use non-toxic cleaning solutions and reusable cloths instead of paper towels and chemicals.', 6, 8),
  (13, 1, 'Shorter Shower / Water Off', 'Shower 5 minutes or less, turn off water while lathering/brushing teeth.', 3, 8),
  (14, 1, 'Reduce Dishwashing Water', 'Use a dishwasher with full loads instead of hand-washing under running water.', 3, 6),

  -- 2020 Commissioner's Challenge (challenge 2)
  (15, 2, 'Meatless Day', 'Reduce environmental impact of food choices with less meat, namely red meat.', 2, 8),
  (16, 2, 'Reduce Wasted Food', 'Save leftovers, compost scraps, and reduce portion waste.', 2, 6),
  (17, 2, 'Unplug Electronics', 'Disconnect devices that draw phantom power — chargers, coffee makers, desktops.', 4, 8),
  (18, 2, 'Shut Off Computer', 'Power down your workstation at end of day and sleep mode when away.', 4, 6),
  (19, 2, 'Sustainable Transportation', 'Bike, walk, carpool, or use public transit instead of driving alone.', 5, 8),
  (20, 2, 'Avoid Single-Use Plastics', 'Eliminate single-use food and beverage items for the day.', 6, 8),
  (21, 2, 'Avoid Printing', 'Email documents, share screens, use digital instead of printing.', 6, 4),
  (22, 2, 'Shorter Shower', 'Reduce shower time to 5 minutes or less.', 3, 8),
  (23, 2, 'Use Reusable Bags', 'Bring your own bags for shopping — avoid single-use plastic/paper bags.', 6, 6),

  -- 2022 Earth Month Challenge (challenge 3)
  (24, 3, 'Water — Shorter Showers & Leak Check', 'Reduce weekly showering to 20 min total, complete water calculator, and check for leaks.', 3, 4),
  (25, 3, 'Water — Reduce Toilet Flushes', 'All of Good level plus only flush after "number two."', 3, 6),
  (26, 3, 'Water — Reduce Appliance Water', 'All of Better level plus only run dishwasher/washer when full.', 3, 8),
  (27, 3, 'Food — Eliminate Red Meat', 'Reduce wasted food and eliminate red meat from your diet.', 2, 4),
  (28, 3, 'Food — Go Vegetarian', 'Reduce wasted food and eliminate all meat including poultry and fish.', 2, 6),
  (29, 3, 'Food — Go Vegan', 'Reduce wasted food and eliminate all animal products including dairy and eggs.', 2, 8),
  (30, 3, 'Consumption — Single-Use Audit', 'Audit rooms for single-use items and swap for reusables.', 6, 4),
  (31, 3, 'Consumption — Waste Log & Reuse', 'Keep a waste log and commit to borrowing, renting, and repairing.', 6, 6),
  (32, 3, 'Consumption — Buy Nothing', 'Only buy necessities for the month plus waste log and audit.', 6, 8),
  (33, 3, 'Energy — Cold Wash & Line Dry', 'Wash laundry in cold water and hang to dry, plus one energy action of choice.', 4, 4),
  (34, 3, 'Energy — Opt for Renewable', 'All of Good level plus sign up for renewable energy credits with your utility.', 4, 6),
  (35, 3, 'Energy — Reduce Vehicle Miles', 'All of Better level plus cut personal vehicle miles by half.', 4, 8),

  -- 2024 Earth Month Challenge (challenge 4)
  (36, 4, 'Water — Skip or Short Shower', 'Skip a shower/bath today OR only shower for 5 minutes or less.', 3, 4),
  (37, 4, 'Food — Plant-Based Diet', 'Eat a fully plant-based diet today (no red or white meat, fish, or dairy).', 2, 4),
  (38, 4, 'Consumption — No Non-Essential Purchases', 'Choose not to buy any non-essential items today.', 6, 4),
  (39, 4, 'Energy — Unplug & Power Down', 'Unplug electronic chargers when not in use and fully power down your workstation at end of day.', 4, 4),
  (40, 4, 'Transportation — No Single-Occupancy Vehicle', 'Walk, bike, use public transportation, or carpool instead of driving alone.', 5, 4),

  -- Earth Month 2026 (challenge 5)
  (41, 5, 'Water Conservation', 'Reduce daily water usage — shorter showers, fix leaks, full loads only.', 3, 5),
  (42, 5, 'Plant-Based Eating', 'Choose plant-based meals and reduce food waste.', 2, 5),
  (43, 5, 'Reduce & Reuse', 'Avoid non-essential purchases, single-use items, and commit to reuse.', 6, 5),
  (44, 5, 'Energy Efficiency', 'Unplug devices, power down workstations, and reduce home energy use.', 4, 5),
  (45, 5, 'Sustainable Transportation', 'Walk, bike, carpool, or use public transit instead of driving alone.', 5, 5),

  -- Clean Commute Week (challenge 6)
  (46, 6, 'Carpool to Work', 'Share a ride with one or more coworkers.', 5, 8),
  (47, 6, 'Take Public Transit', 'Use bus or light rail for your commute.', 5, 10),
  (48, 6, 'Bike to Work', 'Use a bicycle for your commute instead of driving.', 5, 10),
  (49, 6, 'Walk to Nearby Errands', 'Walk instead of drive for trips under 1 mile.', 5, 5),
  (50, 6, 'Plan Routes to Minimize Travel', 'Start your day by planning routes to minimize unnecessary or extra travel.', 5, 4);

SELECT setval('actions_id_seq', 50);

-- ============================================================
-- PARTICIPATION
-- ============================================================
INSERT INTO participation (id, user_id, challenge_id, action_id, completed_at, notes, photo_url) VALUES
  -- 2019 Commissioner's Challenge
  (1,  5,  1, 1,  '2019-01-14', 'Footprint: 3.2 Earths', NULL),
  (2,  5,  1, 4,  '2019-01-14', 'No meat today', NULL),
  (3,  5,  1, 7,  '2019-01-14', 'Unplugged chargers and coffee maker', NULL),
  (4,  5,  1, 9,  '2019-01-15', 'Took the bus to work', NULL),
  (5,  5,  1, 11, '2019-01-15', 'Brought reusable container for lunch', NULL),
  (6,  5,  1, 13, '2019-01-16', '4-minute shower', NULL),
  (7,  5,  1, 4,  '2019-01-17', 'Vegetarian all day', NULL),
  (8,  6,  1, 2,  '2019-01-14', 'Water footprint calculated', NULL),
  (9,  6,  1, 7,  '2019-01-14', '', NULL),
  (10, 6,  1, 8,  '2019-01-15', 'Put computer to sleep during meetings', NULL),
  (11, 6,  1, 12, '2019-01-16', 'Used vinegar solution for cleaning', NULL),
  (12, 6,  1, 14, '2019-01-17', 'Full dishwasher load only', NULL),
  (13, 7,  1, 3,  '2019-01-14', 'Got 100% on waste sort!', NULL),
  (14, 7,  1, 9,  '2019-01-14', 'Biked to work', NULL),
  (15, 7,  1, 10, '2019-01-15', 'Used stairs all day, 4th floor', NULL),
  (16, 7,  1, 5,  '2019-01-16', 'Composted lunch scraps', NULL),
  (17, 7,  1, 6,  '2019-01-17', 'Brought reusable mug', NULL),
  (18, 10, 1, 1,  '2019-01-14', 'Footprint: 2.8 Earths — smallest so far!', NULL),
  (19, 10, 1, 4,  '2019-01-15', '', NULL),
  (20, 10, 1, 7,  '2019-01-15', '', NULL),
  (21, 10, 1, 9,  '2019-01-16', 'Carpooled with 3 others', NULL),
  (22, 10, 1, 13, '2019-01-17', '3-minute shower', NULL),
  (23, 10, 1, 11, '2019-01-18', 'Zero single-use all week!', NULL),

  -- 2020 Commissioner's Challenge
  (24, 5,  2, 15, '2020-01-13', 'No meat Monday', NULL),
  (25, 5,  2, 17, '2020-01-13', 'Unplugged everything at desk', NULL),
  (26, 5,  2, 19, '2020-01-14', 'Took Green Line', NULL),
  (27, 5,  2, 22, '2020-01-15', '4-minute shower', NULL),
  (28, 5,  2, 20, '2020-01-16', 'Brought all reusable items', NULL),
  (29, 8,  2, 15, '2020-01-13', '', NULL),
  (30, 8,  2, 18, '2020-01-14', 'Powered down workstation', NULL),
  (31, 8,  2, 21, '2020-01-14', 'All digital agendas today', NULL),
  (32, 8,  2, 23, '2020-01-15', 'Used tote bags at grocery store', NULL),
  (33, 8,  2, 19, '2020-01-16', 'Biked to work despite cold!', NULL),
  (34, 12, 2, 17, '2020-01-13', '', NULL),
  (35, 12, 2, 16, '2020-01-14', 'Meal prepped to avoid waste', NULL),
  (36, 12, 2, 22, '2020-01-15', '', NULL),
  (37, 12, 2, 20, '2020-01-17', 'No single-use plastics all week', NULL),
  (38, 10, 2, 15, '2020-01-13', '', NULL),
  (39, 10, 2, 19, '2020-01-14', 'Walked to work', NULL),
  (40, 10, 2, 17, '2020-01-15', '', NULL),
  (41, 10, 2, 22, '2020-01-16', '', NULL),

  -- 2022 Earth Month Challenge
  (42, 9,  3, 26, '2022-04-04', 'Committed to Best water level', NULL),
  (43, 9,  3, 28, '2022-04-04', 'Going vegetarian for the month', NULL),
  (44, 9,  3, 31, '2022-04-11', 'Started waste log — eye-opening!', NULL),
  (45, 9,  3, 34, '2022-04-18', 'Signed up for Xcel Windsource', NULL),
  (46, 11, 3, 24, '2022-04-04', 'Good level water — checking for leaks', NULL),
  (47, 11, 3, 27, '2022-04-04', 'Eliminating red meat', NULL),
  (48, 11, 3, 30, '2022-04-11', 'Audited kitchen — found 8 swappable items', NULL),
  (49, 11, 3, 33, '2022-04-11', 'Cold wash and line dry all week', NULL),
  (50, 5,  3, 25, '2022-04-04', 'Better water level', NULL),
  (51, 5,  3, 29, '2022-04-04', 'Attempting vegan for the month!', NULL),
  (52, 5,  3, 32, '2022-04-11', 'Buy nothing — this is hard', NULL),
  (53, 5,  3, 35, '2022-04-18', 'Reduced driving by 60%', NULL),
  (54, 6,  3, 24, '2022-04-04', '', NULL),
  (55, 6,  3, 27, '2022-04-11', '', NULL),
  (56, 6,  3, 30, '2022-04-18', 'Swapped paper towels for cloths', NULL),

  -- 2024 Earth Month Challenge - Carla Martinez
  (57,  9, 4, 36, '2024-04-01', 'Short shower', NULL),
  (58,  9, 4, 38, '2024-04-01', '', NULL),
  (59,  9, 4, 40, '2024-04-01', 'Biked to work', NULL),
  (60,  9, 4, 38, '2024-04-02', '', NULL),
  (61,  9, 4, 40, '2024-04-02', '', NULL),
  (62,  9, 4, 36, '2024-04-03', '', NULL),
  (63,  9, 4, 38, '2024-04-03', '', NULL),
  (64,  9, 4, 40, '2024-04-03', '', NULL),
  (65,  9, 4, 36, '2024-04-04', '', NULL),
  (66,  9, 4, 38, '2024-04-04', '', NULL),
  (67,  9, 4, 40, '2024-04-04', '', NULL),
  (68,  9, 4, 36, '2024-04-05', '', NULL),
  (69,  9, 4, 38, '2024-04-05', '', NULL),
  (70,  9, 4, 40, '2024-04-05', '', NULL),
  (71,  9, 4, 36, '2024-04-06', '', NULL),
  (72,  9, 4, 38, '2024-04-06', '', NULL),
  (73,  9, 4, 40, '2024-04-06', '', NULL),
  (74,  9, 4, 36, '2024-04-07', '', NULL),
  (75,  9, 4, 38, '2024-04-07', '', NULL),
  (76,  9, 4, 40, '2024-04-07', '', NULL),
  (77,  9, 4, 36, '2024-04-08', '', NULL),
  (78,  9, 4, 38, '2024-04-08', '', NULL),
  (79,  9, 4, 40, '2024-04-08', '', NULL),
  (80,  9, 4, 36, '2024-04-09', '', NULL),
  (81,  9, 4, 38, '2024-04-09', '', NULL),
  (82,  9, 4, 40, '2024-04-09', '', NULL),
  (83,  9, 4, 36, '2024-04-10', '', NULL),
  (84,  9, 4, 38, '2024-04-10', '', NULL),
  (85,  9, 4, 40, '2024-04-10', '', NULL),
  (86,  9, 4, 36, '2024-04-11', '', NULL),
  (87,  9, 4, 40, '2024-04-11', '', NULL),
  (88,  9, 4, 36, '2024-04-12', '', NULL),
  (89,  9, 4, 37, '2024-04-12', 'Full plant-based day', NULL),
  (90,  9, 4, 38, '2024-04-12', '', NULL),
  (91,  9, 4, 40, '2024-04-12', '', NULL),
  (92,  9, 4, 38, '2024-04-13', '', NULL),
  (93,  9, 4, 40, '2024-04-13', '', NULL),
  (94,  9, 4, 36, '2024-04-14', '', NULL),
  (95,  9, 4, 37, '2024-04-14', '', NULL),
  (96,  9, 4, 38, '2024-04-14', '', NULL),
  (97,  9, 4, 36, '2024-04-15', '', NULL),
  (98,  9, 4, 37, '2024-04-15', '', NULL),
  (99,  9, 4, 38, '2024-04-15', '', NULL),
  (100, 9, 4, 40, '2024-04-15', '', NULL),
  (101, 9, 4, 36, '2024-04-16', '', NULL),
  (102, 9, 4, 37, '2024-04-16', '', NULL),
  (103, 9, 4, 38, '2024-04-16', '', NULL),
  (104, 9, 4, 40, '2024-04-16', '', NULL),
  (105, 9, 4, 36, '2024-04-17', '', NULL),
  (106, 9, 4, 38, '2024-04-17', '', NULL),
  (107, 9, 4, 36, '2024-04-18', '', NULL),
  (108, 9, 4, 37, '2024-04-18', '', NULL),
  (109, 9, 4, 38, '2024-04-18', '', NULL),
  (110, 9, 4, 40, '2024-04-18', '', NULL),

  -- 2024 - Sarah Johnson
  (111, 5, 4, 36, '2024-04-01', '', NULL),
  (112, 5, 4, 37, '2024-04-01', '', NULL),
  (113, 5, 4, 38, '2024-04-01', '', NULL),
  (114, 5, 4, 40, '2024-04-02', 'Took the bus', NULL),
  (115, 5, 4, 36, '2024-04-03', '', NULL),
  (116, 5, 4, 37, '2024-04-03', '', NULL),
  (117, 5, 4, 39, '2024-04-04', 'Unplugged everything at desk', NULL),
  (118, 5, 4, 40, '2024-04-05', '', NULL),

  -- 2024 - David Nguyen
  (119, 10, 4, 36, '2024-04-01', '', NULL),
  (120, 10, 4, 38, '2024-04-01', '', NULL),
  (121, 10, 4, 39, '2024-04-02', '', NULL),
  (122, 10, 4, 40, '2024-04-02', 'Biked in!', NULL),
  (123, 10, 4, 37, '2024-04-03', '', NULL),
  (124, 10, 4, 36, '2024-04-04', '', NULL),
  (125, 10, 4, 38, '2024-04-05', '', NULL),

  -- 2024 - Emily Olson
  (126, 11, 4, 37, '2024-04-01', 'Already mostly plant-based', NULL),
  (127, 11, 4, 38, '2024-04-01', '', NULL),
  (128, 11, 4, 36, '2024-04-02', '', NULL),
  (129, 11, 4, 37, '2024-04-02', '', NULL),
  (130, 11, 4, 39, '2024-04-03', '', NULL),
  (131, 11, 4, 40, '2024-04-03', 'Walked to work — nice day', NULL),

  -- Clean Commute Week
  (132, 5,  6, 46, '2026-03-03', 'Carpooled with 2 coworkers', NULL),
  (133, 6,  6, 47, '2026-03-03', 'Took the Green Line', NULL),
  (134, 8,  6, 49, '2026-03-03', 'Walked to the post office', NULL),
  (135, 5,  6, 47, '2026-03-04', '', NULL),
  (136, 8,  6, 46, '2026-03-04', '', NULL),
  (137, 9,  6, 48, '2026-03-04', 'Beautiful morning for a ride', NULL),
  (138, 10, 6, 50, '2026-03-03', 'Planned all errands into one trip', NULL),
  (139, 10, 6, 47, '2026-03-04', 'Metro Transit', NULL),
  (140, 11, 6, 48, '2026-03-05', 'First bike commute of 2026!', NULL),
  (141, 12, 6, 46, '2026-03-05', 'Carpooled with neighbor', NULL);

SELECT setval('participation_id_seq', 141);

-- ============================================================
-- REPORTS
-- ============================================================
INSERT INTO reports (id, challenge_id, generated_by, generated_at, title, filters, file_url) VALUES
  (1, 4, 1, '2024-05-05 14:00', '2024 Challenge Participation Export', '{"status": "Completed"}', NULL),
  (2, 6, 2, '2026-03-01 12:30', 'Clean Commute Week Participation Export', '{"status": "Active"}', NULL);

SELECT setval('reports_id_seq', 2);

-- ============================================================
-- ACTIVITY LOGS
-- ============================================================
INSERT INTO activity_logs (id, user_id, action_type, timestamp, details) VALUES
  (1,  1, 'Created challenge',   '2019-01-07 09:00', 'Created "2019 Commissioner''s Sustainability Challenge"'),
  (2,  1, 'Archived challenge',  '2019-01-25 10:00', 'Archived "2019 Commissioner''s Sustainability Challenge"'),
  (3,  1, 'Created challenge',   '2020-01-06 09:00', 'Created "2020 Commissioner''s Sustainability Challenge"'),
  (4,  1, 'Archived challenge',  '2020-01-24 10:00', 'Archived "2020 Commissioner''s Sustainability Challenge"'),
  (5,  1, 'Created challenge',   '2022-03-15 11:00', 'Created "2022 Earth Month Sustainability Challenge"'),
  (6,  1, 'Archived challenge',  '2022-05-10 09:00', 'Archived "2022 Earth Month Sustainability Challenge"'),
  (7,  1, 'Created challenge',   '2024-03-10 10:30', 'Created "2024 Earth Month Sustainability Challenge"'),
  (8,  1, 'Completed challenge', '2024-05-01 09:00', 'Marked "2024 Earth Month Sustainability Challenge" as Completed'),
  (9,  1, 'Exported report',     '2024-05-05 14:00', 'Exported 2024 challenge participation data as CSV'),
  (10, 1, 'Updated user role',   '2026-01-16 08:45', 'Set Eli Goldberger to Admin'),
  (11, 1, 'Updated user role',   '2026-01-16 08:50', 'Set Khue Vo to Admin'),
  (12, 1, 'Updated user role',   '2026-01-16 08:55', 'Set Rudy Vergara to Admin'),
  (13, 1, 'Deactivated user',    '2024-06-01 16:00', 'Deactivated Lisa Park'),
  (14, 2, 'Created challenge',   '2026-02-20 14:00', 'Created "Clean Commute Week"'),
  (15, 1, 'Created challenge',   '2026-02-25 11:00', 'Created "Earth Month Challenge 2026"'),
  (16, 2, 'Exported report',     '2026-03-01 12:30', 'Exported Clean Commute Week participation CSV'),
  (17, 3, 'Updated challenge',   '2026-03-03 10:00', 'Updated "Clean Commute Week" description');

SELECT setval('activity_logs_id_seq', 17);
