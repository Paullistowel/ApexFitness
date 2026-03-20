import { useState } from "react";
import { MOCK_USER } from "../data/mockData";
import "./Sidebar.css";

/**
 * Sidebar
 * Props:
 *   activeScreen  – string: current screen id, e.g. "dashboard"
 *   navigate      – fn(screenId): called when user clicks a nav item
 */
interface SidebarProps {
  activeScreen?: string;
  navigate: (id: string) => void;
}
export default function Sidebar({ activeScreen, navigate }: SidebarProps) {
  const [workoutOpen, setWorkoutOpen] = useState(true);
  const [dietOpen,    setDietOpen]    = useState(false);

  const NavItem = ({ id, icon, label, isChild = false }: { id: string, icon: string, label: string, isChild?: boolean }) => (
    <button
      className={`nav-item ${activeScreen === id ? "active" : ""}`}
      style={isChild ? { paddingLeft: 28 } : {}}
      onClick={() => navigate(id)}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label-text">{label}</span>
    </button>
  );

  return (
    <aside className="sidebar">

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="sidebar-nav">

        <NavItem id="dashboard" icon="⊞" label="Dashboard" />

        {/* Training */}
        <div className="nav-section-label">Training</div>
        <button
          className="nav-item nav-parent"
          onClick={() => setWorkoutOpen(o => !o)}
        >
          <span className="nav-icon">🏋️</span>
          <span className="nav-label-text">Workouts</span>
          <span className={`nav-chevron ${workoutOpen ? "open" : ""}`}>›</span>
        </button>
        {workoutOpen && (
          <div className="nav-sub-group">
            <NavItem id="start-workout"   icon="▶"  label="Start Workout"   isChild />
            <NavItem id="workout-library" icon="📚" label="Workout Library" isChild />
            <NavItem id="workout-plan"    icon="📋" label="Workout Plan"    isChild />
          </div>
        )}

        {/* Nutrition */}
        <div className="nav-section-label">Nutrition</div>
        <button
          className="nav-item nav-parent"
          onClick={() => setDietOpen(o => !o)}
        >
          <span className="nav-icon">🥗</span>
          <span className="nav-label-text">Diet & Nutrition</span>
          <span className={`nav-chevron ${dietOpen ? "open" : ""}`}>›</span>
        </button>
        {dietOpen && (
          <div className="nav-sub-group">
            <button className="nav-item" style={{ paddingLeft: 28 }}><span className="nav-icon">📄</span><span className="nav-label-text">Diet Plan</span></button>
            <button className="nav-item" style={{ paddingLeft: 28 }}><span className="nav-icon">📝</span><span className="nav-label-text">Log Meal</span></button>
            <button className="nav-item" style={{ paddingLeft: 28 }}><span className="nav-icon">💧</span><span className="nav-label-text">Water Tracker</span></button>
          </div>
        )}

        {/* Community */}
        <div className="nav-section-label">Community</div>
        <button className="nav-item"><span className="nav-icon">💬</span><span className="nav-label-text">Chat with Trainer</span></button>
        <button className="nav-item"><span className="nav-icon">🔔</span><span className="nav-label-text">Notification</span></button>

        {/* Account */}
        <div className="nav-section-label">Account</div>
        <button className="nav-item"><span className="nav-icon">👤</span><span className="nav-label-text">Profile</span></button>
        <button className="nav-item"><span className="nav-icon">⚙️</span><span className="nav-label-text">Settings</span></button>

      </nav>

      {/* ── User Footer ──────────────────────────────────────────────────── */}
      <div className="sidebar-user">
        <div className="user-avatar">{MOCK_USER.initials}</div>
        <div className="user-info">
          <div className="user-name">{MOCK_USER.name}</div>
          <div className="user-meta">{MOCK_USER.memberType} · {MOCK_USER.goal}</div>
        </div>
      </div>

    </aside>
  );
}
