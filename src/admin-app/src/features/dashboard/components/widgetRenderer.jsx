/**
 * widgetRenderer -- maps a widget id to the React component that renders
 * it, given the aggregated `stats` object.
 *
 * Pulled out of DashboardPage so the registry is easy to extend without
 * editing the page. To add a new widget:
 *   1. Drop the component under ./widgets/MyWidget.jsx.
 *   2. Register its id here in WIDGET_COMPONENTS.
 *   3. Add the matching entry in dashboardConfig.js.
 */

import CategoryPieWidget from "../widgets/CategoryPieWidget";
import ChallengeStatusWidget from "../widgets/ChallengeStatusWidget";
import ChallengeSummaryWidget from "../widgets/ChallengeSummaryWidget";
import CompletionRatesWidget from "../widgets/CompletionRatesWidget";
import GroupPerformanceWidget from "../widgets/GroupPerformanceWidget";
import LeaderboardWidget from "../widgets/LeaderboardWidget";
import MostActiveUsersWidget from "../widgets/MostActiveUsersWidget";
import ParticipationBarWidget from "../widgets/ParticipationBarWidget";
import PointsByChallengeWidget from "../widgets/PointsByChallengeWidget";
import PointsDistributionWidget from "../widgets/PointsDistributionWidget";
import RecentActivityWidget from "../widgets/RecentActivityWidget";
import StatWidget from "../widgets/StatWidget";
import UpcomingChallengesWidget from "../widgets/UpcomingChallengesWidget";
import UserGrowthWidget from "../widgets/UserGrowthWidget";

const WIDGET_COMPONENTS = {
  "table-challenge-summary": ChallengeSummaryWidget,
  "chart-category-pie": CategoryPieWidget,
  "chart-participation-bar": ParticipationBarWidget,
  "list-leaderboard": LeaderboardWidget,
  "table-most-active": MostActiveUsersWidget,
  "chart-challenge-status": ChallengeStatusWidget,
  "chart-points-by-challenge": PointsByChallengeWidget,
  "chart-user-growth": UserGrowthWidget,
  "chart-group-performance": GroupPerformanceWidget,
  "chart-completion-rates": CompletionRatesWidget,
  "chart-points-distribution": PointsDistributionWidget,
  "list-recent-activity": RecentActivityWidget,
  "list-upcoming": UpcomingChallengesWidget,
};

/**
 * Render the widget with id `widgetId`, passing the dashboard `stats`.
 * Stat-card widgets share a single component and dispatch on the id
 * suffix (e.g. "stat-active-challenges").
 *
 * @param {string} widgetId
 * @param {object | null} stats
 * @returns {JSX.Element | null}
 */
export function renderWidget(widgetId, stats) {
  if (!stats) return null;
  if (widgetId.startsWith("stat-")) {
    return <StatWidget data={stats} widgetId={widgetId} />;
  }
  const Component = WIDGET_COMPONENTS[widgetId];
  return Component ? <Component data={stats} /> : null;
}
