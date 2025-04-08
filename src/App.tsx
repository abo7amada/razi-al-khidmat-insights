import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SurveyPage from "./pages/SurveyPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";
import SurveyCreatorPage from "./pages/SurveyCreatorPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import UsersPage from "./pages/UsersPage";
import SitesPage from "./pages/SitesPage";
import InsightsPage from "./pages/InsightsPage";
import VendorSettingsPage from "./pages/VendorSettingsPage";
import LoginPage from "./pages/LoginPage";
import SuperAdminPage from "./pages/SuperAdminPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import SubscriptionExpiredPage from "./pages/SubscriptionExpiredPage";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerSurveyPage from "./pages/CustomerSurveyPage";
import SurveyPreviewPage from "./pages/SurveyPreviewPage";
import EvaluationsPage from "./pages/EvaluationsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import StatsPage from "./pages/StatsPage";
import TemplateLibraryPage from "./pages/TemplateLibraryPage";
import ManualEntryPage from "./pages/ManualEntryPage";
import CommentsReportPage from "./pages/CommentsReportPage";
import SiteBuilderPage from "./pages/SiteBuilderPage";

// Import insights pages
import InsightsLayout from "./components/insights/InsightsLayout";
import OverviewPage from "./pages/insights/OverviewPage";
import InsightsAnalyticsPage from "./pages/insights/InsightsAnalyticsPage";
import BranchBenchmarkPage from "./pages/insights/BranchBenchmarkPage";
import SentimentAnalysisPage from "./pages/insights/SentimentAnalysisPage";
import SmartAlertsPage from "./pages/insights/SmartAlertsPage";
import AdvancedSegmentationPage from "./pages/insights/AdvancedSegmentationPage";
import ComingSoonPage from "./pages/insights/ComingSoonPage";
import CompaniesPage from "./pages/CompaniesPage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/subscription-expired" element={<SubscriptionExpiredPage />} />
      
      {/* Public survey page */}
      <Route path="/survey" element={<CustomerSurveyPage />} />
      <Route path="/survey-preview" element={<SurveyPreviewPage />} />
      
      {/* مسارات المدير الرئيسي */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin']}>
          <SuperAdminPage />
        </ProtectedRoute>
      } />
      
      {/* رابط خاص بإدارة الشركات */}
      <Route path="/companies" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'admin']}>
          <CompaniesPage />
        </ProtectedRoute>
      } />
      
      {/* المسارات المحمية التي تتطلب تسجيل الدخول واشتراكًا نشطًا */}
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/survey" element={
        <ProtectedRoute requireActiveSubscription>
          <SurveyPage />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute requireActiveSubscription>
          <ReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/survey-creator" element={
        <ProtectedRoute requireActiveSubscription allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'editor']}>
          <SurveyCreatorPage />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute requireActiveSubscription>
          <AnalyticsPage />
        </ProtectedRoute>
      } />
      <Route path="/insights" element={
        <ProtectedRoute requireActiveSubscription allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'branchManager']}>
          <InsightsPage />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner']}>
          <UsersPage />
        </ProtectedRoute>
      } />
      {/* Redirect from /locations to /sites */}
      <Route path="/locations" element={<Navigate to="/sites" replace />} />
      <Route path="/sites" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'editor']}>
          <SitesPage />
        </ProtectedRoute>
      } />
      <Route path="/vendor-settings" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin']}>
          <VendorSettingsPage />
        </ProtectedRoute>
      } />
      
      {/* Site Builder */}
      <Route path="/company/:id/site-builder" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner']}>
          <SiteBuilderPage />
        </ProtectedRoute>
      } />
      
      {/* New feedback routes */}
      <Route path="/company/:id/evaluations" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'editor', 'viewer', 'branchManager']}>
          <EvaluationsPage />
        </ProtectedRoute>
      } />
      <Route path="/company/:id/complaints" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'editor', 'branchManager']}>
          <ComplaintsPage />
        </ProtectedRoute>
      } />
      <Route path="/company/:id/reports" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'editor', 'viewer', 'branchManager']}>
          <StatsPage />
        </ProtectedRoute>
      } />
      <Route path="/company/:id/templates" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'editor']}>
          <TemplateLibraryPage />
        </ProtectedRoute>
      } />
      <Route path="/company/:id/manual-entry" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'editor', 'branchManager']}>
          <ManualEntryPage />
        </ProtectedRoute>
      } />
      {/* New Comments Report Page */}
      <Route path="/company/:id/reports/comments" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'editor', 'viewer', 'branchManager']}>
          <CommentsReportPage />
        </ProtectedRoute>
      } />
      
      {/* Insights Routes */}
      <Route path="/company/:id/insights" element={
        <ProtectedRoute requireActiveSubscription allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner', 'editor', 'viewer', 'branchManager']}>
          <InsightsLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="analytics" element={<InsightsAnalyticsPage />} />
        <Route path="branchBenchmark" element={<BranchBenchmarkPage />} />
        <Route path="sentimentAnalysis" element={<SentimentAnalysisPage />} />
        <Route path="smartAlerts" element={<SmartAlertsPage />} />
        <Route path="advancedSegmentation" element={<AdvancedSegmentationPage />} />
        <Route path="comingSoon" element={<ComingSoonPage />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
