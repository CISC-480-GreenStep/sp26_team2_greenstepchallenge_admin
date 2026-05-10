/**
 * @file ComparisonMode.jsx
 * @summary Multi-challenge comparison view rendered when admins select 2+ challenges.
 *
 * Coordinates four chart cards plus a summary table; the heavy lifting
 * (data shaping, chart layout) lives in `useComparisonData` and the
 * sibling components under `./components/comparison/`. This file only
 * decides the responsive grid and forwards data into each card.
 */

import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";

import AverageActionsChart from "./components/comparison/AverageActionsChart";
import CategoryBreakdownChart from "./components/comparison/CategoryBreakdownChart";
import ComparisonSummaryTable from "./components/comparison/ComparisonSummaryTable";
import RelativeEngagementChart from "./components/comparison/RelativeEngagementChart";
import TotalsBarChart from "./components/comparison/TotalsBarChart";
import { useComparisonData } from "./hooks/useComparisonData";

/**
 * @param {object} props
 * @param {object} props.stats - Aggregated dashboard stats from `useDashboardStats`.
 * @param {object[]} props.challenges - All challenges (full set, not just selected).
 * @param {(string|number)[]} props.selectedChallengeIds - IDs of challenges to compare.
 */
export default function ComparisonMode({ stats, challenges, selectedChallengeIds }) {
  const selectedChallenges = challenges.filter((c) => selectedChallengeIds.includes(c.id));
  const { barData, stackedCategoryData, categoryKeys, avgActionsData } = useComparisonData(
    stats,
    selectedChallenges,
  );

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("Container Width on Load:", document.getElementById('chart-container')?.offsetWidth);
  }, [ready]);

  // Cards grow with the number of selected challenges so labels never overlap.
  const dynamicHeight = Math.max(600, 450 + selectedChallengeIds.length * 35);
  const compositeKey = selectedChallengeIds.join("-") + "-" + ready;

  return (
    <Box sx={{ mt: 2, mx: { sm: -1, md: -2 } }}>
      <Grid container spacing={2}>
        {ready && (
          <>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Box id="chart-container" key={`rel-${compositeKey}`} sx={{ width: "100% !important", height: "600px !important" }}>
                <RelativeEngagementChart
                  comparisonData={stats.comparisonData}
                  selectedChallenges={selectedChallenges}
                  selectedChallengeIds={selectedChallengeIds}
                  height={dynamicHeight}
                />
              </Box>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Box key={`cat-${compositeKey}`} sx={{ width: "100% !important", height: "600px !important" }}>
                <CategoryBreakdownChart
                  stackedCategoryData={stackedCategoryData}
                  categoryKeys={categoryKeys}
                  selectedChallengeIds={selectedChallengeIds}
                  height={dynamicHeight}
                />
              </Box>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Box key={`tot-${compositeKey}`} sx={{ width: "100% !important", height: "600px !important" }}>
                <TotalsBarChart
                  barData={barData}
                  selectedChallengeIds={selectedChallengeIds}
                  height={dynamicHeight}
                />
              </Box>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Box key={`avg-${compositeKey}`} sx={{ width: "100% !important", height: "600px !important" }}>
                <AverageActionsChart
                  avgActionsData={avgActionsData}
                  selectedChallengeIds={selectedChallengeIds}
                  height={dynamicHeight}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <ComparisonSummaryTable
                selectedChallenges={selectedChallenges}
                barData={barData}
                stackedCategoryData={stackedCategoryData}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
