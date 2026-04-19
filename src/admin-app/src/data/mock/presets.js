import { CHALLENGE_STATUSES } from "./challenges";

const presets = [
  {
    id: 1,
    name: "H2O Hero Week",
    description: "A week-long challenge focused on reducing water waste in the office and at home.",
    category: "Water",
    theme: "#2196F3",
    status: CHALLENGE_STATUSES.UPCOMING,
    actions: [
      {
        name: "Shorter Shower / Water Off",
        description: "Shower 5 minutes or less, turn off water while lathering/brushing teeth.",
        category: "Water",
        points: 8,
      },
      {
        name: "Reduce Dishwashing Water",
        description:
          "Use a dishwasher with full loads instead of hand-washing under running water.",
        category: "Water",
        points: 6,
      },
      {
        name: "Fix a Leak",
        description: "Check faucets, toilets, and hoses for leaks and fix or report them.",
        category: "Water",
        points: 10,
      },
      {
        name: "Reduce Toilet Flushes",
        description: 'Only flush after "number two" to reduce water use.',
        category: "Water",
        points: 4,
      },
      {
        name: "Full Laundry Loads Only",
        description: "Only run the washing machine with full loads and use cold water.",
        category: "Water",
        points: 6,
      },
    ],
    createdAt: "2026-02-01",
  },
  {
    id: 2,
    name: "Power Down Challenge",
    description:
      "Compete to see who can reduce their energy footprint the most by unplugging devices.",
    category: "Energy",
    theme: "#FFC107",
    status: CHALLENGE_STATUSES.UPCOMING,
    actions: [
      {
        name: "Unplug Electronics",
        description:
          "Disconnect devices that draw phantom power — chargers, coffee makers, desktops.",
        category: "Energy",
        points: 8,
      },
      {
        name: "Shut Off Computer",
        description: "Power down your workstation at end of day and sleep mode when away.",
        category: "Energy",
        points: 6,
      },
      {
        name: "Use Stairs Instead of Elevator",
        description: "Take the stairs to reduce elevator energy and improve health.",
        category: "Energy",
        points: 4,
      },
      {
        name: "Switch to LED",
        description: "Replace at least one incandescent or CFL bulb with LED.",
        category: "Energy",
        points: 10,
      },
    ],
    createdAt: "2026-02-01",
  },
  {
    id: 3,
    name: "Sustainable Commute Week",
    description: "Encourage employees to use sustainable transportation for their daily commute.",
    category: "Transportation",
    theme: "#4CAF50",
    status: CHALLENGE_STATUSES.UPCOMING,
    actions: [
      {
        name: "Carpool to Work",
        description: "Share a ride with one or more coworkers.",
        category: "Transportation",
        points: 8,
      },
      {
        name: "Take Public Transit",
        description: "Use the bus, light rail, or other public transit.",
        category: "Transportation",
        points: 8,
      },
      {
        name: "Bike to Work",
        description: "Commute by bicycle for the day.",
        category: "Transportation",
        points: 10,
      },
      {
        name: "Walk or Run",
        description: "Walk or run to your destination instead of driving.",
        category: "Transportation",
        points: 10,
      },
      {
        name: "Combine Errands",
        description: "Plan your trips to reduce total miles driven.",
        category: "Transportation",
        points: 6,
      },
    ],
    createdAt: "2026-02-15",
  },
];

export default presets;
