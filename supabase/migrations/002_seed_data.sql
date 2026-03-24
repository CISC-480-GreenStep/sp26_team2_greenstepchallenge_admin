-- ============================================================
-- GreenStep Challenge Admin -- Seed Data
-- Run this AFTER 001_initial_schema.sql
-- ============================================================

-- Departments
insert into departments (id, name, description, "createdAt") values
(1, 'MPCA Staff', 'Minnesota Pollution Control Agency employees', '2025-09-01'),
(2, 'DNR Team', 'Department of Natural Resources staff', '2025-10-15'),
(3, 'April 2026 Cohort', 'Participants in the April 2026 sustainability push', '2026-02-01'),
(4, 'Building A', 'Employees in Building A campus', '2026-01-10');
select setval(pg_get_serial_sequence('departments', 'id'), 4);

-- Users
insert into users (id, name, email, role, status, "groupId", department, "createdAt", "lastActive") values
(1, 'Kristin Mroz-Risse', 'kristin.mroz@mpca.mn.gov', 'SuperAdmin', 'Active', 1, 'Environmental Analysis', '2018-06-01', '2026-03-04'),
(2, 'Eli Goldberger', 'eli.goldberger@example.com', 'Admin', 'Active', 1, 'IT Services', '2026-01-15', '2026-03-05'),
(3, 'Khue Vo', 'khue.vo@example.com', 'Admin', 'Active', 1, 'IT Services', '2026-01-15', '2026-03-04'),
(4, 'Rudy Vergara', 'rudy.vergara@example.com', 'Admin', 'Active', 1, 'IT Services', '2026-01-15', '2026-03-03'),
(5, 'Sarah Johnson', 'sarah.johnson@mpca.mn.gov', 'GeneralUser', 'Active', 1, 'Water Quality', '2019-01-10', '2026-03-02'),
(6, 'Mike Chen', 'mike.chen@mpca.mn.gov', 'GeneralUser', 'Active', 2, 'Air Quality', '2019-01-10', '2026-03-01'),
(7, 'Lisa Park', 'lisa.park@mpca.mn.gov', 'GeneralUser', 'Deactivated', 4, 'Remediation', '2019-01-10', '2024-05-01'),
(8, 'James Williams', 'james.w@mpca.mn.gov', 'GeneralUser', 'Active', 2, 'Air Quality', '2020-01-08', '2026-03-04'),
(9, 'Carla Martinez', 'carla.martinez@mpca.mn.gov', 'GeneralUser', 'Active', 1, 'Environmental Analysis', '2022-03-15', '2026-03-03'),
(10, 'David Nguyen', 'david.nguyen@mpca.mn.gov', 'GeneralUser', 'Active', 1, 'Water Quality', '2019-01-10', '2026-02-28'),
(11, 'Emily Olson', 'emily.olson@mpca.mn.gov', 'GeneralUser', 'Active', 2, 'Remediation', '2022-03-20', '2026-03-01'),
(12, 'Tom Anderson', 'tom.anderson@mpca.mn.gov', 'GeneralUser', 'Active', 4, 'Environmental Analysis', '2020-01-08', '2026-02-25');
select setval(pg_get_serial_sequence('users', 'id'), 12);

-- Actions
insert into actions (id, name, description, category, points) values
(1, 'Complete Ecological Footprint Calculator', 'Calculate your ecological footprint. Leader with the smallest footprint earns the most points.', 'Consumption & Waste', 15),
(2, 'Complete Water Footprint Calculator', 'Assess your direct and virtual water use patterns using the water calculator.', 'Water', 15),
(3, 'Waste Sort Challenge', 'Complete a waste sort, determining which items should be recycled, composted, or trashed.', 'Consumption & Waste', 8),
(4, 'Meatless Day', 'Reduce environmental impact of food choices with less meat, namely red meat.', 'Food', 8),
(5, 'Reduce Wasted Food', 'Save and compost food rather than throwing it in the trash.', 'Food', 6),
(6, 'Use Reusable Drink Container', 'Avoid single-use cups -- use reusable containers for beverages.', 'Food', 4),
(7, 'Unplug Electronics', 'Unplug electronics and appliances that draw phantom power when not in use.', 'Energy', 8),
(8, 'Shut Off Computer', 'Shut off your computer/monitor at end of day and sleep mode when away.', 'Energy', 6),
(9, 'Sustainable Transportation', 'Avoid personal gas-powered vehicle -- use transit, bike, walk, or carpool.', 'Transportation', 8),
(10, 'Take the Stairs', 'Use the stairs instead of the elevator to reduce energy and improve health.', 'Transportation', 4),
(11, 'Avoid Single-Use Plastics', 'No single-use food/beverage items -- bring your own plates, utensils, napkins.', 'Consumption & Waste', 8),
(12, 'Use Sustainable Cleaning', 'Use non-toxic cleaning solutions and reusable cloths instead of paper towels and chemicals.', 'Consumption & Waste', 8),
(13, 'Shorter Shower / Water Off', 'Shower 5 minutes or less, turn off water while lathering/brushing teeth.', 'Water', 8),
(14, 'Reduce Dishwashing Water', 'Use a dishwasher with full loads instead of hand-washing under running water.', 'Water', 6),
(15, 'Meatless Day', 'Reduce environmental impact of food choices with less meat, namely red meat.', 'Food', 8),
(16, 'Reduce Wasted Food', 'Save leftovers, compost scraps, and reduce portion waste.', 'Food', 6),
(17, 'Unplug Electronics', 'Disconnect devices that draw phantom power -- chargers, coffee makers, desktops.', 'Energy', 8),
(18, 'Shut Off Computer', 'Power down your workstation at end of day and sleep mode when away.', 'Energy', 6),
(19, 'Sustainable Transportation', 'Bike, walk, carpool, or use public transit instead of driving alone.', 'Transportation', 8),
(20, 'Avoid Single-Use Plastics', 'Eliminate single-use food and beverage items for the day.', 'Consumption & Waste', 8),
(21, 'Avoid Printing', 'Email documents, share screens, use digital instead of printing.', 'Consumption & Waste', 4),
(22, 'Shorter Shower', 'Reduce shower time to 5 minutes or less.', 'Water', 8),
(23, 'Use Reusable Bags', 'Bring your own bags for shopping -- avoid single-use plastic/paper bags.', 'Consumption & Waste', 6),
(24, 'Water -- Shorter Showers & Leak Check', 'Reduce weekly showering to 20 min total, complete water calculator, and check for leaks.', 'Water', 4),
(25, 'Water -- Reduce Toilet Flushes', 'All of Good level plus only flush after "number two."', 'Water', 6),
(26, 'Water -- Reduce Appliance Water', 'All of Better level plus only run dishwasher/washer when full.', 'Water', 8),
(27, 'Food -- Eliminate Red Meat', 'Reduce wasted food and eliminate red meat from your diet.', 'Food', 4),
(28, 'Food -- Go Vegetarian', 'Reduce wasted food and eliminate all meat including poultry and fish.', 'Food', 6),
(29, 'Food -- Go Vegan', 'Reduce wasted food and eliminate all animal products including dairy and eggs.', 'Food', 8),
(30, 'Consumption -- Single-Use Audit', 'Audit rooms for single-use items and swap for reusables.', 'Consumption & Waste', 4),
(31, 'Consumption -- Waste Log & Reuse', 'Keep a waste log and commit to borrowing, renting, and repairing.', 'Consumption & Waste', 6),
(32, 'Consumption -- Buy Nothing', 'Only buy necessities for the month plus waste log and audit.', 'Consumption & Waste', 8),
(33, 'Energy -- Cold Wash & Line Dry', 'Wash laundry in cold water and hang to dry, plus one energy action of choice.', 'Energy', 4),
(34, 'Energy -- Opt for Renewable', 'All of Good level plus sign up for renewable energy credits with your utility.', 'Energy', 6),
(35, 'Energy -- Reduce Vehicle Miles', 'All of Better level plus cut personal vehicle miles by half.', 'Energy', 8),
(36, 'Water -- Skip or Short Shower', 'Skip a shower/bath today OR only shower for 5 minutes or less.', 'Water', 4),
(37, 'Food -- Plant-Based Diet', 'Eat a fully plant-based diet today (no red or white meat, fish, or dairy).', 'Food', 4),
(38, 'Consumption -- No Non-Essential Purchases', 'Choose not to buy any non-essential items today (essentials: food, medication, soap, toilet paper).', 'Consumption & Waste', 4),
(39, 'Energy -- Unplug & Power Down', 'Unplug electronic chargers when not in use and fully power down your workstation at end of day.', 'Energy', 4),
(40, 'Transportation -- No Single-Occupancy Vehicle', 'Walk, bike, use public transportation, or carpool instead of driving alone.', 'Transportation', 4),
(41, 'Water Conservation', 'Reduce daily water usage -- shorter showers, fix leaks, full loads only.', 'Water', 5),
(42, 'Plant-Based Eating', 'Choose plant-based meals and reduce food waste.', 'Food', 5),
(43, 'Reduce & Reuse', 'Avoid non-essential purchases, single-use items, and commit to reuse.', 'Consumption & Waste', 5),
(44, 'Energy Efficiency', 'Unplug devices, power down workstations, and reduce home energy use.', 'Energy', 5),
(45, 'Sustainable Transportation', 'Walk, bike, carpool, or use public transit instead of driving alone.', 'Transportation', 5),
(46, 'Carpool to Work', 'Share a ride with one or more coworkers.', 'Transportation', 8),
(47, 'Take Public Transit', 'Use bus or light rail for your commute.', 'Transportation', 10),
(48, 'Bike to Work', 'Use a bicycle for your commute instead of driving.', 'Transportation', 10),
(49, 'Walk to Nearby Errands', 'Walk instead of drive for trips under 1 mile.', 'Transportation', 5),
(50, 'Plan Routes to Minimize Travel', 'Start your day by planning routes to minimize unnecessary or extra travel.', 'Transportation', 4);
select setval(pg_get_serial_sequence('actions', 'id'), 50);

-- Challenges
insert into challenges (id, name, description, category, theme, "startDate", "endDate", "joinBy", status, "createdBy", "participantCount", "groupId") values
(1, '2019 Commissioner''s Sustainability Challenge', 'A week-long challenge where MPCA employees tracked daily sustainability actions across food, energy, mobility, goods/services, and water categories with weighted point scoring.', 'General Sustainability', '#4CAF50', '2019-01-14', '2019-01-18', '2019-01-13', 'Archived', 1, 34, 1),
(2, '2020 Commissioner''s Sustainability Challenge', 'Second annual week-long challenge with the same daily action tracking format, focusing on reducing environmental impact through everyday choices.', 'General Sustainability', '#2196F3', '2020-01-13', '2020-01-17', '2020-01-12', 'Archived', 1, 41, 1),
(3, '2022 Earth Month Sustainability Challenge', 'Month-long April challenge with tiered difficulty levels (Good, Better, Best) across Water, Food, Consumption & Waste, and Energy categories. Participants chose their commitment level and tracked daily progress.', 'General Sustainability', '#FF9800', '2022-04-04', '2022-04-29', '2022-04-03', 'Archived', 1, 52, 1),
(4, '2024 Earth Month Sustainability Challenge', 'Month-long April challenge with five daily yes/no sustainability actions: Water, Food, Consumption, Energy, and Transportation. Participants earned points for each completed action per day.', 'General Sustainability', '#00BCD4', '2024-04-01', '2024-04-28', '2024-03-31', 'Completed', 1, 38, 1),
(5, 'Earth Month Challenge 2026', 'Upcoming month-long sustainability challenge for April 2026. Actions and scoring are being designed based on feedback from prior years.', 'General Sustainability', '#9C27B0', '2026-04-01', '2026-04-30', '2026-03-31', 'Upcoming', 1, 0, 3),
(6, 'Clean Commute Week', 'One-week challenge encouraging biking, walking, carpooling, or transit for daily commutes.', 'Transportation', '#795548', '2026-03-03', '2026-03-07', '2026-03-02', 'Active', 2, 28, 1);
select setval(pg_get_serial_sequence('challenges', 'id'), 6);

-- Challenge -> Actions
insert into challenge_actions ("challengeId", "actionId") values
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),
(2,15),(2,16),(2,17),(2,18),(2,19),(2,20),(2,21),(2,22),(2,23),
(3,24),(3,25),(3,26),(3,27),(3,28),(3,29),(3,30),(3,31),(3,32),(3,33),(3,34),(3,35),
(4,36),(4,37),(4,38),(4,39),(4,40),
(5,41),(5,42),(5,43),(5,44),(5,45),
(6,46),(6,47),(6,48),(6,49),(6,50);

-- Challenge -> Participants
insert into challenge_participants ("challengeId", "userId") values
(1,5),(1,6),(1,7),(1,10),
(2,5),(2,8),(2,10),(2,12),
(3,5),(3,6),(3,9),(3,11),
(4,5),(4,9),(4,10),(4,11),
(6,5),(6,6),(6,8),(6,9),(6,10),(6,11),(6,12);

-- Templates
insert into templates (id, name, description, type, category, theme, "createdBy", "createdAt", "joinBy", "participantGroup") values
(1, 'Commissioner''s Sustainability Challenge', 'A week-long challenge where employees track daily sustainability actions across food, energy, mobility, goods/services, and water categories with weighted point scoring.', 'Weekly', 'General Sustainability', '#4CAF50', 1, '2018-12-01', null, 1),
(2, 'Earth Month Challenge', 'Month-long April challenge with daily sustainability actions across Water, Food, Consumption, Energy, and Transportation categories.', 'Monthly', 'General Sustainability', '#9C27B0', 1, '2022-03-01', null, 1),
(3, 'Clean Commute Week', 'One-week challenge encouraging biking, walking, carpooling, or transit for daily commutes.', 'Weekly', 'Transportation', '#795548', 2, '2026-02-01', null, 1),
(4, 'H2O Hero Week', 'A week-long challenge focused on reducing water waste in the office and at home.', 'Weekly', 'Water', '#2196F3', 1, '2026-02-01', null, null),
(5, 'Power Down Challenge', 'Compete to see who can reduce their energy footprint the most by unplugging devices.', 'Weekly', 'Energy', '#FFC107', 1, '2026-02-01', null, null);
select setval(pg_get_serial_sequence('templates', 'id'), 5);

-- Presets
insert into presets (id, name, description, category, theme, status, "createdAt") values
(1, 'H2O Hero Week', 'A week-long challenge focused on reducing water waste in the office and at home.', 'Water', '#2196F3', 'Upcoming', '2026-02-01'),
(2, 'Power Down Challenge', 'Compete to see who can reduce their energy footprint the most by unplugging devices.', 'Energy', '#FFC107', 'Upcoming', '2026-02-01'),
(3, 'Sustainable Commute Week', 'Encourage employees to use sustainable transportation for their daily commute.', 'Transportation', '#4CAF50', 'Upcoming', '2026-02-15');
select setval(pg_get_serial_sequence('presets', 'id'), 3);

insert into preset_actions ("presetId", name, description, category, points) values
(1, 'Shorter Shower / Water Off', 'Shower 5 minutes or less, turn off water while lathering/brushing teeth.', 'Water', 8),
(1, 'Reduce Dishwashing Water', 'Use a dishwasher with full loads instead of hand-washing under running water.', 'Water', 6),
(1, 'Fix a Leak', 'Check faucets, toilets, and hoses for leaks and fix or report them.', 'Water', 10),
(1, 'Reduce Toilet Flushes', 'Only flush after "number two" to reduce water use.', 'Water', 4),
(1, 'Full Laundry Loads Only', 'Only run the washing machine with full loads and use cold water.', 'Water', 6),
(2, 'Unplug Electronics', 'Disconnect devices that draw phantom power -- chargers, coffee makers, desktops.', 'Energy', 8),
(2, 'Shut Off Computer', 'Power down your workstation at end of day and sleep mode when away.', 'Energy', 6),
(2, 'Use Stairs Instead of Elevator', 'Take the stairs to reduce elevator energy and improve health.', 'Energy', 4),
(2, 'Switch to LED', 'Replace at least one incandescent or CFL bulb with LED.', 'Energy', 10),
(3, 'Carpool to Work', 'Share a ride with one or more coworkers.', 'Transportation', 8),
(3, 'Take Public Transit', 'Use the bus, light rail, or other public transit.', 'Transportation', 8),
(3, 'Bike to Work', 'Commute by bicycle for the day.', 'Transportation', 10),
(3, 'Walk or Run', 'Walk or run to your destination instead of driving.', 'Transportation', 10),
(3, 'Combine Errands', 'Plan your trips to reduce total miles driven.', 'Transportation', 6);

-- Participation
insert into participation ("userId", "challengeId", "actionId", "completedAt", notes, "photoUrl") values
(5,1,1,'2019-01-14','Footprint: 3.2 Earths',null),
(5,1,4,'2019-01-14','No meat today',null),
(5,1,7,'2019-01-14','Unplugged chargers and coffee maker',null),
(5,1,9,'2019-01-15','Took the bus to work',null),
(5,1,11,'2019-01-15','Brought reusable container for lunch',null),
(5,1,13,'2019-01-16','4-minute shower',null),
(5,1,4,'2019-01-17','Vegetarian all day',null),
(6,1,2,'2019-01-14','Water footprint calculated',null),
(6,1,7,'2019-01-14','',null),
(6,1,8,'2019-01-15','Put computer to sleep during meetings',null),
(6,1,12,'2019-01-16','Used vinegar solution for cleaning',null),
(6,1,14,'2019-01-17','Full dishwasher load only',null),
(7,1,3,'2019-01-14','Got 100% on waste sort!',null),
(7,1,9,'2019-01-14','Biked to work',null),
(7,1,10,'2019-01-15','Used stairs all day, 4th floor',null),
(7,1,5,'2019-01-16','Composted lunch scraps',null),
(7,1,6,'2019-01-17','Brought reusable mug',null),
(10,1,1,'2019-01-14','Footprint: 2.8 Earths',null),
(10,1,4,'2019-01-15','',null),
(10,1,7,'2019-01-15','',null),
(10,1,9,'2019-01-16','Carpooled with 3 others',null),
(10,1,13,'2019-01-17','3-minute shower',null),
(10,1,11,'2019-01-18','Zero single-use all week!',null),
(5,2,15,'2020-01-13','No meat Monday',null),
(5,2,17,'2020-01-13','Unplugged everything at desk',null),
(5,2,19,'2020-01-14','Took Green Line',null),
(5,2,22,'2020-01-15','4-minute shower',null),
(5,2,20,'2020-01-16','Brought all reusable items',null),
(8,2,15,'2020-01-13','',null),
(8,2,18,'2020-01-14','Powered down workstation',null),
(8,2,21,'2020-01-14','All digital agendas today',null),
(8,2,23,'2020-01-15','Used tote bags at grocery store',null),
(8,2,19,'2020-01-16','Biked to work despite cold!',null),
(12,2,17,'2020-01-13','',null),
(12,2,16,'2020-01-14','Meal prepped to avoid waste',null),
(12,2,22,'2020-01-15','',null),
(12,2,20,'2020-01-17','No single-use plastics all week',null),
(10,2,15,'2020-01-13','',null),
(10,2,19,'2020-01-14','Walked to work',null),
(10,2,17,'2020-01-15','',null),
(10,2,22,'2020-01-16','',null),
(9,3,26,'2022-04-04','Committed to Best water level',null),
(9,3,28,'2022-04-04','Going vegetarian for the month',null),
(9,3,31,'2022-04-11','Started waste log',null),
(9,3,34,'2022-04-18','Signed up for Xcel Windsource',null),
(11,3,24,'2022-04-04','Good level water',null),
(11,3,27,'2022-04-04','Eliminating red meat',null),
(11,3,30,'2022-04-11','Audited kitchen',null),
(11,3,33,'2022-04-11','Cold wash and line dry all week',null),
(5,3,25,'2022-04-04','Better water level',null),
(5,3,29,'2022-04-04','Attempting vegan for the month!',null),
(5,3,32,'2022-04-11','Buy nothing',null),
(5,3,35,'2022-04-18','Reduced driving by 60%',null),
(6,3,24,'2022-04-04','',null),
(6,3,27,'2022-04-11','',null),
(6,3,30,'2022-04-18','Swapped paper towels for cloths',null),
(9,4,36,'2024-04-01','Short shower',null),
(9,4,38,'2024-04-01','',null),
(9,4,40,'2024-04-01','Biked to work',null),
(9,4,38,'2024-04-02','',null),
(9,4,40,'2024-04-02','',null),
(9,4,36,'2024-04-03','',null),
(9,4,38,'2024-04-03','',null),
(9,4,40,'2024-04-03','',null),
(5,4,36,'2024-04-01','',null),
(5,4,37,'2024-04-01','',null),
(5,4,38,'2024-04-01','',null),
(5,4,40,'2024-04-02','Took the bus',null),
(5,4,36,'2024-04-03','',null),
(5,4,37,'2024-04-03','',null),
(5,4,39,'2024-04-04','Unplugged everything at desk',null),
(5,4,40,'2024-04-05','',null),
(10,4,36,'2024-04-01','',null),
(10,4,38,'2024-04-01','',null),
(10,4,39,'2024-04-02','',null),
(10,4,40,'2024-04-02','Biked in!',null),
(10,4,37,'2024-04-03','',null),
(10,4,36,'2024-04-04','',null),
(10,4,38,'2024-04-05','',null),
(11,4,37,'2024-04-01','Already mostly plant-based',null),
(11,4,38,'2024-04-01','',null),
(11,4,36,'2024-04-02','',null),
(11,4,37,'2024-04-02','',null),
(11,4,39,'2024-04-03','',null),
(11,4,40,'2024-04-03','Walked to work',null),
(5,6,46,'2026-03-03','Carpooled with 2 coworkers',null),
(6,6,47,'2026-03-03','Took the Green Line',null),
(8,6,49,'2026-03-03','Walked to the post office',null),
(5,6,47,'2026-03-04','',null),
(8,6,46,'2026-03-04','',null),
(9,6,48,'2026-03-04','Beautiful morning for a ride',null),
(10,6,50,'2026-03-03','Planned all errands into one trip',null),
(10,6,47,'2026-03-04','Metro Transit',null),
(11,6,48,'2026-03-05','First bike commute of 2026!',null),
(12,6,46,'2026-03-05','Carpooled with neighbor',null);

-- Activity Logs
insert into activity_logs ("userId", action, timestamp, details) values
(1, 'Created challenge', '2019-01-07 09:00', 'Created 2019 Commissioner''s Sustainability Challenge'),
(1, 'Created challenge', '2020-01-06 09:00', 'Created 2020 Commissioner''s Sustainability Challenge'),
(1, 'Created challenge', '2022-03-15 10:00', 'Created 2022 Earth Month Sustainability Challenge'),
(1, 'Archived challenge', '2022-05-01 08:00', 'Archived 2019 Commissioner''s Sustainability Challenge'),
(1, 'Archived challenge', '2022-05-01 08:05', 'Archived 2020 Commissioner''s Sustainability Challenge'),
(1, 'Created challenge', '2024-03-01 09:00', 'Created 2024 Earth Month Sustainability Challenge'),
(1, 'Archived challenge', '2024-05-01 08:00', 'Archived 2022 Earth Month Sustainability Challenge'),
(1, 'Updated user role', '2026-01-15 10:00', 'Set Eli Goldberger to Admin'),
(1, 'Updated user role', '2026-01-15 10:05', 'Set Khue Vo to Admin'),
(1, 'Updated user role', '2026-01-15 10:10', 'Set Rudy Vergara to Admin'),
(2, 'Created challenge', '2026-02-20 14:00', 'Created Clean Commute Week'),
(1, 'Created challenge', '2026-02-25 09:00', 'Created Earth Month Challenge 2026');
