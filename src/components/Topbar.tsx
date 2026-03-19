import { MOCK_USER } from "../data/mockData";
import "./Topbar.css";
import logo from "../assets/ApexFitness.logo.png";

/**
 * Topbar
 * Props: navigate - function to change screens
 */
interface TopbarProps {
  navigate?: (id: string) => void;
}
export default function Topbar({ navigate }: TopbarProps) {
  return (
    <header className="topbar">
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="topbar-logo-area" onClick={() => navigate?.("dashboard")}>
        <img
          src={logo}
          alt="ApexFitness"
          className="topbar-logo-img"
        />
      </div>

      <div className="topbar-search">
        <span className="search-icon">🔍</span>
        <input placeholder="Search ..." />
      </div>

      <div className="topbar-actions">
        {/* Notification bell */}
        <div className="notif-wrap">
          <button className="notif-btn" aria-label="Notifications">🔔</button>
          <span className="notif-badge">{MOCK_USER.notifications}</span>
        </div>

        {/* User chip */}
        <div className="user-chip">
          <div className="chip-avatar">{MOCK_USER.initials}</div>
          <span className="chip-name">{MOCK_USER.shortName}</span>
          <span className="chip-caret">▾</span>
        </div>
      </div>
    </header>
  );
}
