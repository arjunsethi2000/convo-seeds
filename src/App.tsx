import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import OnboardingSlides from "./pages/OnboardingSlides";
import FirstPrompt from "./pages/FirstPrompt";
import ProfileSetup from "./pages/ProfileSetup";
import Feed from "./pages/Feed";
import DailyPrompt from "./pages/DailyPrompt";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Onboarding Flow */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/onboarding" element={<OnboardingSlides />} />
          <Route path="/first-prompt" element={<FirstPrompt />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          
          {/* Main App */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Feed />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prompt"
            element={
              <ProtectedRoute>
                <DailyPrompt />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:matchId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
