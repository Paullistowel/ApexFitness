import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage";
import ContactPage from "./pages/ContactUsPage/ContactPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/DashboardPage/Dashboard";
import StartWorkout from "./pages/WorkoutPages/StartWorkpage/StartWorkout";

function App() {
  return (
    <BrowserRouter>
      <div className="font-sans">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* App routes — all share sidebar layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts/start" element={<StartWorkout />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
