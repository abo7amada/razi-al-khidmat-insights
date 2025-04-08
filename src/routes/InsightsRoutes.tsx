
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import InsightsLayout from '../components/insights/InsightsLayout';
import OverviewPage from '../pages/insights/OverviewPage';
import InsightsAnalyticsPage from '../pages/insights/InsightsAnalyticsPage';
import BranchBenchmarkPage from '../pages/insights/BranchBenchmarkPage';
import SentimentAnalysisPage from '../pages/insights/SentimentAnalysisPage';
import SmartAlertsPage from '../pages/insights/SmartAlertsPage';
import AdvancedSegmentationPage from '../pages/insights/AdvancedSegmentationPage';
import ComingSoonPage from '../pages/insights/ComingSoonPage';

const InsightsRoutes = () => (
  <Route path="insights" element={<InsightsLayout />}>
    <Route index element={<Navigate to="overview" replace />} />
    <Route path="overview" element={<OverviewPage />} />
    <Route path="analytics" element={<InsightsAnalyticsPage />} />
    <Route path="branchBenchmark" element={<BranchBenchmarkPage />} />
    <Route path="sentimentAnalysis" element={<SentimentAnalysisPage />} />
    <Route path="smartAlerts" element={<SmartAlertsPage />} />
    <Route path="advancedSegmentation" element={<AdvancedSegmentationPage />} />
    <Route path="comingSoon" element={<ComingSoonPage />} />
  </Route>
);

export default InsightsRoutes;
