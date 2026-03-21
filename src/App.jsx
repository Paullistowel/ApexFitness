import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/Shared/LoadingSpinner";
import Toaster from "./components/Toast/Toaster";

/* ─── Layouts (small, load eagerly) ─────────────────────────────────────── */
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

/* ─── Lazy pages ─────────────────────────────────────────────────────────── */
const LandingPage        = lazy(() => import("./pages/landingPage/LandingPage"));
const ContactPage        = lazy(() => import("./pages/ContactUsPage/ContactPage"));
const AuthPage           = lazy(() => import("./pages/AuthPage/AuthPage"));
const ForgotPasswordPage = lazy(() => import("./pages/AuthPage/ForgotPasswordPage"));
const Dashboard          = lazy(() => import("./pages/DashboardPage/Dashboard"));
const WorkoutsPage       = lazy(() => import("./pages/WorkoutPages/WorkoutsPage"));
const WorkoutPlanPage    = lazy(() => import("./pages/workoutPlan/WorkoutPlanPage"));
const DietPlanPage       = lazy(() => import("./pages/DietPlan/DietPlanPage"));
const LogMeal            = lazy(() => import("./pages/LogMeal/LogMeal"));
const WaterTracker       = lazy(() => import("./pages/WaterTracker/WaterTrackerPage"));
const ChatWithTrainer    = lazy(() => import("./pages/ChatwithTrainer/ChatWithTrainer"));
const NotificationPage   = lazy(() => import("./pages/NotificationPage/NotificationPage"));
const ProfilePage        = lazy(() => import("./pages/Profile/ProfilePage"));
const SettingsPage       = lazy(() => import("./pages/SettingsPage/SettingsPage"));
const AdminPanel         = lazy(() => import("./pages/AdminPanel/AdminPanel"));
const ProgressPage       = lazy(() => import("./pages/Progress/ProgressPage"));
const WorkoutHistory     = lazy(() => import("./pages/WorkoutHistory/WorkoutHistory"));
const NotFoundPage       = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));

function App() {
  return (
    <BrowserRouter>
     
        <Suspense fallback={<LoadingSpinner />}>
          <div className="font-sans">
            <Routes>
              {/* Standalone pages */}
              <Route path="/"                element={<LandingPage />} />
              <Route path="/auth"            element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Public pages with NavBar + Footer */}
              <Route element={<MainLayout />}>
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* App routes — sidebar layout */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard"          element={<Dashboard />} />
                <Route path="/workouts"           element={<WorkoutsPage />} />
                <Route path="/workouts/plan"      element={<WorkoutPlanPage />} />
                <Route path="/diet"               element={<DietPlanPage />} />
                <Route path="/nutrition/log-meal" element={<LogMeal />} />
                <Route path="/nutrition/water"    element={<WaterTracker />} />
                <Route path="/trainer"            element={<ChatWithTrainer />} />
                <Route path="/notifications"      element={<NotificationPage />} />
                <Route path="/profile"            element={<ProfilePage />} />
                <Route path="/settings"           element={<SettingsPage />} />
                <Route path="/admin"              element={<AdminPanel />} />
                <Route path="/progress"          element={<ProgressPage />} />
                <Route path="/workouts/history"  element={<WorkoutHistory />} />
              </Route>

              {/* 404 — catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Suspense>
        <Toaster />
     
    </BrowserRouter>
  );
}

export default App;
