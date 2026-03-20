/**
 * App.jsx  —  The Router
 *
 * This is the equivalent of what <a href="..."> links do in HTML.
 * It holds the active screen in state and swaps the page component
 * rendered inside the shared shell (Sidebar + Topbar).
 *
 * To add a new page:
 *   1. Create  src/pages/MyNewPage.jsx + MyNewPage.css
 *   2. Import it here
 *   3. Add a case to renderPage()
 *   4. Add a nav-item to Sidebar.jsx pointing to the same id
 */

import { useState } from "react";

// Shared layout components
import Sidebar from "./components/Sidebar";
import Topbar  from "./components/Topbar";

// Pages
import Dashboard      from "./pages/Dashboard/Dashboard";
import StartWorkout   from "./pages/StartWorkout/StartWorkout";
import WorkoutLibrary from "./pages/WorkoutLibrary/WorkoutLibrary";
import WorkoutPlan    from "./pages/WorkoutPlan/WorkoutPlan";

// Global styles (CSS variables, resets, shared utilities)
import "./styles/global.css";

export default function App() {
  // ── Router state ──────────────────────────────────────────────────────────
  // `screen` acts like the current URL path in a traditional website.
  // Call navigate("screen-id") from any component to change the active page.
  const [screen,       setScreen]       = useState("dashboard");
  const [timerMinutes, setTimerMinutes] = useState(20); // shared between WorkoutPlan → StartWorkout

  const navigate = (screenId: string) => setScreen(screenId);

  // ── Page resolver ─────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (screen) {
      case "dashboard":
        return <Dashboard navigate={navigate} />;

      case "start-workout":
        return <StartWorkout navigate={navigate} timerMinutes={timerMinutes} />;

      case "workout-library":
        return <WorkoutLibrary navigate={navigate} />;

      case "workout-plan":
        return <WorkoutPlan navigate={navigate} setTimerMinutes={setTimerMinutes} />;

      default:
        return <Dashboard navigate={navigate} />;
    }
  };

  // ── Shell ─────────────────────────────────────────────────────────────────
  return (
    <div className="app-shell" style={{ flexDirection: 'column' }}>
      <Topbar navigate={navigate} />

      <div className="main-row" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left sidebar — always visible, highlights the active screen */}
        <Sidebar activeScreen={screen} navigate={navigate} />

        {/* Right column — scrollable page content */}
        <div className="main-column">
          <main className="page-content">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}
