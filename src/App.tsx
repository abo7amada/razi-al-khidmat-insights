
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
import VendorSettingsPage from "./pages/VendorSettingsPage";
import LoginPage from "./pages/LoginPage";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Index />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/survey-creator" element={<SurveyCreatorPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/locations" element={<LocationsPage />} />
      <Route path="/vendor-settings" element={<VendorSettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
