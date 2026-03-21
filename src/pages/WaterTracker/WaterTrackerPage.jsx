import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
  Droplets,
  Plus,
  Minus,
  Trash2,
  Bell,
  BellOff,
  Sparkles,
  X,
  Target,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ML_GOAL = 3000;

const quickAmounts = [
  { label: "250 ml", value: 250,  icon: "🥤" },
  { label: "500 ml", value: 500,  icon: "🍶" },
  { label: "1 L",    value: 1000, icon: "🫙" },
];

const weekHistory = [
  { day: "Mon", amount: 2800 },
  { day: "Tue", amount: 3000 },
  { day: "Wed", amount: 2400 },
  { day: "Thu", amount: 3200 },
  { day: "Fri", amount: 1800 },
  { day: "Sat", amount: 2600 },
  { day: "Sun", amount: 3000 },
];

const TODAY_IDX = 4; // Friday

function fmt(ml) {
  return ml >= 1000 ? `${(ml / 1000).toFixed(1)} L` : `${ml} ml`;
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Circular Ring Progress ───────────────────────────────────────────────────
function WaterRing({ consumed, goal }) {
  const pct          = Math.min(consumed / goal, 1);
  const radius       = 110;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference * (1 - pct);
  const color        = pct >= 1 ? "#22c55e" : pct >= 0.6 ? "#38bdf8" : "#93c5fd";

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto">
      {/* Glow */}
      <div
        className="absolute w-48 h-48 rounded-full blur-2xl opacity-20 transition-all duration-500"
        style={{ backgroundColor: color }}
      />
      {/* SVG ring */}
      <svg width="256" height="256" className="-rotate-90 absolute">
        <circle cx="128" cy="128" r={radius} fill="none" stroke="#e0f2fe" strokeWidth="14" />
        <circle
          cx="128" cy="128" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
        />
      </svg>

      {/* Center text */}
      <div className="flex flex-col items-center z-10">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: color + "22" }}>
          <Droplets size={28} style={{ color }} />
        </div>
        <span className="text-4xl font-black text-foreground">
          {(consumed / 1000).toFixed(1)} L
        </span>
        <span className="text-sm text-muted font-semibold mt-0.5">
          of {goal / 1000}.0 L goal
        </span>
        <span
          className="mt-2 text-sm font-black px-3 py-1 rounded-full"
          style={{ backgroundColor: color + "22", color }}
        >
          {Math.round(pct * 100)}%
        </span>
      </div>
    </div>
  );
}

// ─── Log Entry ─────────────────────────────────────────────────────────────────
function LogEntry({ entry, onDelete }) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-2xl bg-overlay/5 border border-border/10 hover:border-blue-500/20 hover:bg-overlay/10 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
        <Droplets size={20} className="text-blue-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-foreground">{fmt(entry.amount)} added</p>
        <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
          <Clock size={10} /> {entry.time}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-blue-400 bg-blue-500/15 px-2.5 py-1 rounded-full">
          +{fmt(entry.amount)}
        </span>
        <button
          onClick={() => onDelete(entry.id)}
          className="w-7 h-7 rounded-full bg-overlay/5 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-red-500/20 transition-all"
        >
          <Trash2 size={12} className="text-muted hover:text-red-400" />
        </button>
      </div>
    </div>
  );
}

// ─── Custom Amount Modal ───────────────────────────────────────────────────────
function CustomAmountModal({ onAdd, onClose }) {
  const [val, setVal] = useState(300);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl p-6 w-full max-w-xs shadow-2xl z-10 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-foreground">Custom Amount</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-overlay/10 flex items-center justify-center">
            <X size={15} className="text-muted" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => setVal((v) => Math.max(50, v - 50))}
            className="w-12 h-12 rounded-full bg-overlay/10 hover:bg-overlay/20 flex items-center justify-center transition-colors"
          >
            <Minus size={18} className="text-foreground/80" />
          </button>
          <div className="text-center">
            <span className="text-4xl font-black text-foreground">{val}</span>
            <span className="text-sm font-semibold text-muted ml-1">ml</span>
          </div>
          <button
            onClick={() => setVal((v) => Math.min(2000, v + 50))}
            className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
          >
            <Plus size={18} className="text-foreground" />
          </button>
        </div>

        {/* Slider */}
        <input
          type="range" min={50} max={2000} step={50}
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-muted -mt-3">
          <span>50 ml</span><span>2000 ml</span>
        </div>

        <button
          onClick={() => { onAdd(val); onClose(); }}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-foreground font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          <Droplets size={15} />
          Add {val} ml
        </button>
      </div>
    </div>
  );
}

// ─── Weekly Chart ──────────────────────────────────────────────────────────────
function WeeklyChart({ data, goal }) {
  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black text-foreground">This Week</p>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Goal: {goal / 1000}L</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} barSize={24} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#1d1a17", color: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            formatter={(v) => [fmt(v), "Intake"]}
          />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={i === TODAY_IDX ? "#38bdf8" : entry.amount >= goal ? "#22c55e" : "#1e4a6e"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-7 gap-1 mt-1">
        {data.map((d, i) => (
          <div key={d.day} className="flex flex-col items-center gap-0.5">
            {d.amount >= goal && (
              <span className="text-[10px] text-green-400 font-black">✓</span>
            )}
            {i === TODAY_IDX && d.amount < goal && (
              <span className="text-[10px] text-blue-400 font-black">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reminder Card ─────────────────────────────────────────────────────────────
function ReminderCard({ enabled, interval, onToggle, onChangeInterval }) {
  const intervals = [1, 2, 3, 4];
  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${enabled ? "bg-blue-500/15" : "bg-overlay/10"}`}>
            {enabled
              ? <Bell size={18} className="text-blue-400" />
              : <BellOff size={18} className="text-muted" />}
          </div>
          <div>
            <p className="text-sm font-black text-foreground">Hydration Reminders</p>
            <p className="text-xs text-muted">
              {enabled ? `Remind every ${interval} hour${interval > 1 ? "s" : ""}` : "Reminders off"}
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? "bg-blue-500" : "bg-overlay/10"}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-0.5"}`} />
        </button>
      </div>

      {enabled && (
        <div>
          <p className="text-xs text-muted mb-2 font-semibold">Remind me every</p>
          <div className="flex gap-2">
            {intervals.map((h) => (
              <button
                key={h}
                onClick={() => onChangeInterval(h)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  interval === h
                    ? "bg-blue-500 text-foreground border-blue-500"
                    : "bg-overlay/5 text-muted border-border/10 hover:border-blue-500/30"
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function WaterTracker() {
  const { toast } = useToast();
  const [consumed, setConsumed]             = useState(1000);
  const [log, setLog]                       = useState([
    { id: 1, amount: 250, time: "9:12 AM"  },
    { id: 2, amount: 500, time: "10:12 AM" },
    { id: 3, amount: 250, time: "12:45 PM" },
  ]);
  const [goal, setGoal]                     = useState(ML_GOAL);
  const [reminder, setReminder]             = useState(true);
  const [reminderInterval, setReminderInterval] = useState(2);
  const [showCustom, setShowCustom]         = useState(false);
  const [showInsight, setShowInsight]       = useState(true);
  const [weekData, setWeekData]             = useState(weekHistory);

  const addWater = (amount) => {
    const entry = { id: Date.now(), amount, time: timeNow() };
    setLog((prev) => [entry, ...prev]);
    setConsumed((prev) => {
      const next = Math.min(prev + amount, goal * 1.5);
      if (next >= goal && prev < goal) {
        toast.success("Goal Reached! 🎉", `You hit your ${goal / 1000}L hydration target.`);
      } else {
        toast.info(`+${fmt(amount)} logged`, "Keep it up — stay hydrated!");
      }
      return next;
    });
    setWeekData((prev) =>
      prev.map((d, i) =>
        i === TODAY_IDX ? { ...d, amount: Math.min(d.amount + amount, 4000) } : d
      )
    );
  };

  const deleteEntry = (id) => {
    const entry = log.find((e) => e.id === id);
    if (entry) {
      setLog((prev) => prev.filter((e) => e.id !== id));
      setConsumed((prev) => Math.max(0, prev - entry.amount));
    }
  };

  const remaining = Math.max(goal - consumed, 0);
  const isGoalMet = consumed >= goal;

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-5">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-foreground">Water Tracker</h1>
            <p className="text-sm text-muted mt-0.5">Stay hydrated, stay focused</p>
          </div>
          <div className="flex items-center gap-2 bg-overlay/5 border border-border/10 rounded-xl px-3 py-2">
            <Target size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-muted">Daily Goal:</span>
            <select
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="text-xs font-black text-foreground bg-transparent focus:outline-none cursor-pointer"
            >
              {[1500, 2000, 2500, 3000, 3500, 4000].map((v) => (
                <option key={v} value={v} className="bg-elevated text-foreground">{v / 1000}L</option>
              ))}
            </select>
          </div>
        </div>

        {/* Goal met banner */}
        {isGoalMet && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-black text-green-400">Daily goal achieved!</p>
              <p className="text-xs text-green-500">Amazing work — you hit your {goal / 1000}L target today.</p>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Left — ring + quick add + chart */}
          <div className="md:col-span-2 space-y-5">

            {/* Ring card */}
            <div className="bg-overlay/5 border border-border/10 rounded-2xl p-6">
              <WaterRing consumed={consumed} goal={goal} />

              {/* Progress bar */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs text-muted">
                  <span>{Math.round((consumed / goal) * 100)}% of daily goal</span>
                  <span className="font-bold text-foreground/80">{fmt(consumed)} / {fmt(goal)}</span>
                </div>
                <div className="h-3 bg-overlay/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((consumed / goal) * 100, 100)}%`,
                      background: isGoalMet
                        ? "linear-gradient(90deg, #22c55e, #4ade80)"
                        : "linear-gradient(90deg, #38bdf8, #7dd3fc)",
                    }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { label: "Consumed",  value: fmt(consumed),               color: "#38bdf8" },
                  { label: "Remaining", value: fmt(remaining),              color: "#f97316" },
                  { label: "Glasses",   value: `${Math.floor(consumed / 250)}`, color: "#a855f7" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-overlay/5 rounded-2xl p-3 text-center">
                    <p className="text-lg font-black" style={{ color }}>{value}</p>
                    <p className="text-[11px] text-muted mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick add */}
            <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
              <p className="text-sm font-black text-foreground mb-4">Quick Add</p>
              <div className="flex gap-3">
                {quickAmounts.map(({ label, value, icon }) => (
                  <button
                    key={value}
                    onClick={() => addWater(value)}
                    className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-blue-500/15 hover:bg-blue-500 group transition-all border-2 border-blue-500/20 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/30"
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="text-sm font-black text-blue-400 group-hover:text-foreground transition-colors">
                      {label}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setShowCustom(true)}
                  className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-overlay/5 hover:bg-overlay/10 group transition-all border-2 border-dashed border-border/10 hover:border-border/20"
                >
                  <Plus size={22} className="text-muted group-hover:text-foreground/80" />
                  <span className="text-sm font-bold text-muted group-hover:text-foreground/80 transition-colors">
                    Custom
                  </span>
                </button>
              </div>
            </div>

            {/* Weekly chart */}
            <WeeklyChart data={weekData} goal={goal} />
          </div>

          {/* Right — AI insight + reminder + log */}
          <div className="space-y-4">

            {/* AI Insight */}
            {showInsight && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-400" />
                    <span className="text-xs font-black text-blue-400">AI Hydration Insight</span>
                  </div>
                  <button
                    onClick={() => setShowInsight(false)}
                    className="text-blue-500 hover:text-blue-300 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Staying well-hydrated boosts workout performance by up to 20% and aids in post-session muscle recovery. You're on track — keep sipping!
                </p>
              </div>
            )}

            {/* Reminder */}
            <ReminderCard
              enabled={reminder}
              interval={reminderInterval}
              onToggle={() => setReminder((p) => !p)}
              onChangeInterval={setReminderInterval}
            />

            {/* Today's log */}
            <div className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/5">
                <p className="text-sm font-black text-foreground">Today's Log</p>
                <span className="text-xs text-muted">{log.length} entries</span>
              </div>
              <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
                {log.length === 0 ? (
                  <div className="flex flex-col items-center py-8 gap-2">
                    <Droplets size={24} className="text-subtle" />
                    <p className="text-xs text-muted">No entries yet today</p>
                  </div>
                ) : (
                  log.map((entry) => (
                    <LogEntry key={entry.id} entry={entry} onDelete={deleteEntry} />
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Custom amount modal */}
      {showCustom && (
        <CustomAmountModal
          onAdd={addWater}
          onClose={() => setShowCustom(false)}
        />
      )}
    </div>
  );
}
