
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Marketplace from "./pages/Marketplace";
import Join from "./pages/Join";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import LeaderboardPage from "./pages/Leaderboard";
import ReportsPage from "./pages/Reports";
import ReportDetails from "./pages/ReportDetails";
import About from "./pages/About";
import Suggestions from "./pages/Suggestions";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendered");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/carte" element={<Map />} />
              <Route path="/classement" element={<LeaderboardPage />} />
              <Route path="/signalements" element={<ReportsPage />} />
              <Route path="/signalement/:id" element={<ReportDetails />} />
              <Route path="/marketplace" element={<Marketplace />} />
              
              <Route path="/a-propos" element={<About />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin/auth" element={<AdminAuth />} />
              <Route path="/dashboard" element={
                <AdminProtectedRoute>
                  <Dashboard />
                </AdminProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
