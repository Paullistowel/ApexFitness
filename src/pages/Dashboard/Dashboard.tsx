import { useState } from "react";
import { MOCK_USER, MOCK_DASHBOARD } from "../../data/mockData";
import "./Dashboard.css";

/**
 * Dashboard page
 * Props:
 *   navigate – fn(screenId)
 */

/* ── Inline chart components (Dashboard-only visuals) ── */
function WeightChart({ data }: { data: any[] }) {
  const W = 300, H = 130, PL = 32, PR = 8, PT = 10, PB = 24;
  const vals = data.map(d => d.weight);
  const mn = Math.min(...vals) - 1;
  const mx = Math.max(...vals) + 1;
  const xs = (i: number) => PL + (i / (data.length - 1)) * (W - PL - PR);
  const ys = (v: number) => H - PB - ((v - mn) / (mx - mn)) * (H - PT - PB);
  const pts = data.map((d, i) => [xs(i), ys(d.weight)]);
  const linePath = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1][0]},${H - PB} L${pts[0][0]},${H - PB} Z`;

  return (
    <div className="chart-area">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F26522" stopOpacity=".25" />
            <stop offset="100%" stopColor="#F26522" stopOpacity=".01" />
          </linearGradient>
        </defs>
        {[81, 83, 85].map(t => (
          <g key={t}>
            <line x1={PL} y1={ys(t)} x2={W - PR} y2={ys(t)} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 2" />
            <text x={PL - 4} y={ys(t) + 4} textAnchor="end" fontSize="9" fill="#9CA3AF">{t}kg</text>
          </g>
        ))}
        <path d={areaPath} fill="url(#weightGrad)" />
        <path d={linePath} fill="none" stroke="#F26522" strokeWidth="2.2" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#F26522" />)}
        {data.map((d, i) => (
          <text key={i} x={xs(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#9CA3AF">{d.day}</text>
        ))}
      </svg>
    </div>
  );
}

function ActiveChart({ data, mode }: { data: any[], mode: string }) {
  const W = 300, H = 130, PL = 28, PR = 8, PT = 10, PB = 24;
  const key  = mode === "Steps" ? "steps" : "workout";
  const maxV = Math.max(...data.map(d => d[key])) * 1.25;
  const bw   = (W - PL - PR) / data.length - 5;

  return (
    <div className="chart-area">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {data.map((d, i) => {
          const v  = d[key];
          const bh = (v / maxV) * (H - PT - PB);
          const x  = PL + i * ((W - PL - PR) / data.length) + 2;
          return (
            <g key={i}>
              <rect x={x} y={H - PB - bh} width={bw} height={bh}
                fill={i === data.length - 1 ? "#F26522" : "#FDDCC8"} rx="3" />
              <text x={x + bw / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="#9CA3AF">{d.day}</text>
            </g>
          );
        })}
        {[1, 2, 3, 4].map(t => {
          const v = mode === "Steps" ? t * 1000 : t * 10;
          return (
            <text key={t} x={PL - 3}
              y={H - PB - (v / maxV) * (H - PT - PB) + 4}
              textAnchor="end" fontSize="9" fill="#9CA3AF">
              {mode === "Steps" ? `${t}k` : `${t * 10}`}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

interface DashboardProps {
  navigate: (path: string) => void;
}

/* ── Dashboard page ── */
export default function Dashboard({ navigate }: DashboardProps) {
  const [weightTab, setWeightTab] = useState("7 days");
  const [activeTab, setActiveTab] = useState("Steps");
  const d     = MOCK_DASHBOARD;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  /* Quick-action shortcuts that link to other screens */
  const shortcuts = [
    { id: "start-workout",    emoji: "⚡", label: "Start Workout",   desc: "Jump into today's session" },
    { id: "workout-library",  emoji: "📚", label: "Workout Library", desc: "Browse all exercises" },
    { id: "workout-plan",     emoji: "📋", label: "Workout Plan",    desc: "View your weekly schedule" },
  ];

  return (
    <div className="screen-enter">
      {/* ── Hero ── */}
      <div className="dash-hero">
        <div>
          <h1 className="dash-welcome">Welcome Back, {MOCK_USER.shortName} 👋</h1>
          <p  className="dash-sub">Here's your progress today.</p>
        </div>
        <div className="date-pill">
          <span className="date-dot" />
          {today}
        </div>
      </div>

      {/* ── Quick Actions (links to other screens) ── */}
      <h2 className="section-heading">Quick Actions</h2>
      <div className="shortcut-grid">
        {shortcuts.map(s => (
          <div key={s.id} className="card shortcut-card" onClick={() => navigate(s.id)} role="button" tabIndex={0}
            onKeyDown={e => e.key === "Enter" && navigate(s.id)}>
            <div className="shortcut-emoji">{s.emoji}</div>
            <div>
              <div className="shortcut-label">{s.label}</div>
              <div className="shortcut-desc">{s.desc}</div>
            </div>
            <div className="shortcut-arrow">→</div>
          </div>
        ))}
      </div>

      {/* ── Today's Overview ── */}
      <h2 className="section-heading">Today's Overview</h2>
      <div className="stats-grid">
        {/* Calories */}
        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: "#FFF3EC" }}>🔥</div>
            <span className="stat-change">↑ {d.caloriesChange}%</span>
          </div>
          <div className="stat-value">{d.caloriesBurned}<span className="stat-unit"> kcal</span></div>
          <div className="stat-label">Burned today</div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: "60%", background: "var(--orange)" }} />
          </div>
        </div>

        {/* Water */}
        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: "#EFF6FF" }}>💧</div>
            <span className="stat-change">↑ {d.waterChange}%</span>
          </div>
          <div className="stat-value">{d.waterConsumed}<span className="stat-unit"> L</span></div>
          <div className="stat-label">Water Consumed</div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: "72%", background: "var(--blue)" }} />
          </div>
        </div>

        {/* Active minutes */}
        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: "#F3F0FF" }}>⏱️</div>
            <span className="stat-change goal">Goal: {d.activeGoal}m</span>
          </div>
          <div className="stat-value">{d.activeMinutes}<span className="stat-unit"> min</span></div>
          <div className="stat-label">Active Minutes</div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: `${(d.activeMinutes / d.activeGoal) * 100}%`, background: "var(--purple)" }} />
          </div>
        </div>
      </div>

      {/* ── Performance charts ── */}
      <h2 className="section-heading">Performance</h2>
      <div className="charts-grid">
        <div className="card chart-card">
          <div className="chart-header">
            <span className="chart-title">Weight Trend</span>
            <div className="tab-group">
              {["7 days", "30 days"].map(t => (
                <button key={t} className={`tab-pill ${weightTab === t ? "active" : ""}`}
                  onClick={() => setWeightTab(t)}>{t}</button>
              ))}
            </div>
          </div>
          <WeightChart data={d.weightTrend} />
        </div>

        <div className="card chart-card">
          <div className="chart-header">
            <span className="chart-title">Active Summary</span>
            <div className="tab-group">
              {["Steps", "Workout"].map(t => (
                <button key={t} className={`tab-pill ${activeTab === t ? "active" : ""}`}
                  onClick={() => setActiveTab(t)}>{t}</button>
              ))}
            </div>
          </div>
          <ActiveChart data={d.activeSummary} mode={activeTab} />
        </div>
      </div>

      {/* ── Quick Action ── */}
      <h2 className="section-heading">Quick Action</h2>
      <div style={{ paddingBottom: '30px' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate("start-workout")}
          style={{ width: "100%", maxWidth: "380px", display: "flex", justifyContent: "center", padding: "14px 24px", fontSize: "15px" }}
        >
          ▶ &nbsp; Start Workout
        </button>
      </div>
    </div>
  );
}
