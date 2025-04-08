
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SurveyPage from "./pages/SurveyPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";
import SurveyCreatorPage from "./pages/SurveyCreatorPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import UsersPage from "./pages/UsersPage";
import LocationsPage from "./pages/LocationsPage";
import SitesPage from "./pages/SitesPage";
import VendorSettingsPage from "./pages/VendorSettingsPage";
import LoginPage from "./pages/LoginPage";
import SuperAdminPage from "./pages/SuperAdminPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import SubscriptionExpiredPage from "./pages/SubscriptionExpiredPage";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/subscription-expired" element={<SubscriptionExpiredPage />} />
      
      {/* مسارات المدير الرئيسي */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin']}>
          <SuperAdminPage />
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
      <Route path="/users" element={
        <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'company_admin', 'company_owner']}>
          <UsersPage />
        </ProtectedRoute>
      } />
      <Route path="/locations" element={
        <ProtectedRoute>
          <LocationsPage />
        </ProtectedRoute>
      } />
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
