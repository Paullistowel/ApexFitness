import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Flame,
  Dumbbell,
  Ruler,
  ChevronRight,
  Star,
  Target,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const weightData = [
  { date: "Jan 1",  weight: 92.0 },
  { date: "Jan 8",  weight: 91.4 },
  { date: "Jan 15", weight: 90.8 },
  { date: "Jan 22", weight: 90.1 },
  { date: "Feb 1",  weight: 89.5 },
  { date: "Feb 8",  weight: 89.0 },
  { date: "Feb 15", weight: 88.2 },
  { date: "Feb 22", weight: 87.9 },
  { date: "Mar 1",  weight: 87.3 },
  { date: "Mar 8",  weight: 86.8 },
  { date: "Mar 15", weight: 86.1 },
  { date: "Mar 21", weight: 85.6 },
];

const bodyMeasurements = [
  { label: "Chest",  value: "98 cm",  change: -2,  icon: "📏" },
  { label: "Waist",  value: "84 cm",  change: -4,  icon: "📐" },
  { label: "Hips",   value: "100 cm", change: -2,  icon: "📏" },
  { label: "Thighs", value: "58 cm",  change: -1,  icon: "📏" },
  { label: "Arms",   value: "34 cm",  change: +1,  icon: "💪" },
  { label: "Neck",   value: "38 cm",  change: 0,   icon: "📏" },
];

const strengthData = [
  { name: "Bench Press",  current: 80,  start: 60,  unit: "kg", color: "#3b82f6"  },
  { name: "Squat",        current: 110, start: 80,  unit: "kg", color: "#a855f7"  },
  { name: "Deadlift",     current: 130, start: 95,  unit: "kg", color: "#f97316"  },
  { name: "OHP",          current: 55,  start: 40,  unit: "kg", color: "#22c55e"  },
  { name: "Pull-ups",     current: 12,  start: 5,   unit: "reps",color: "#06b6d4" },
];

const milestones = [
  { title: "Lost 5 kg",          date: "Feb 1",  icon: "🏆", type: "weight"   },
  { title: "First 10K Steps",    date: "Jan 15", icon: "👟", type: "activity" },
  { title: "Bench 80 kg",        date: "Feb 22", icon: "💪", type: "strength" },
  { title: "7-Day Streak",       date: "Mar 5",  icon: "🔥", type: "streak"   },
  { title: "Deadlift 130 kg",    date: "Mar 10", icon: "🏋️", type: "strength" },
  { title: "Lost 6.4 kg total",  date: "Mar 21", icon: "⭐", type: "weight"   },
];

const RANGES = ["1M", "3M", "6M", "1Y"];

// ─── Custom tooltip ────────────────────────────────────────────────────────────
function WeightTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-border/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-muted">{payload[0]?.payload?.date}</p>
      <p className="font-black text-foreground mt-0.5">{payload[0]?.value} kg</p>
    </div>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0`} style={{ backgroundColor: color + "22" }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted font-semibold">{label}</p>
        <p className="text-2xl font-black text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          trend < 0 ? "bg-green-500/15 text-green-400" :
          trend > 0 ? "bg-red-500/15 text-red-400" :
          "bg-overlay/10 text-muted"
        }`}>
          {trend < 0 ? <TrendingDown size={12} /> : trend > 0 ? <TrendingUp size={12} /> : <Minus size={12} />}
          {Math.abs(trend)} kg
        </div>
      )}
    </div>
  );
}

// ─── Strength row ──────────────────────────────────────────────────────────────
function StrengthRow({ item }) {
  const pct = Math.round(((item.current - item.start) / item.start) * 100);
  const progress = Math.min((item.current / (item.start * 1.5)) * 100, 100);

  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-border/5 last:border-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.color + "22" }}>
        <Dumbbell size={16} style={{ color: item.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-bold text-foreground">{item.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted line-through">{item.start} {item.unit}</span>
            <span className="text-sm font-black" style={{ color: item.color }}>{item.current} {item.unit}</span>
            <span className="text-[11px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded-full">
              +{pct}%
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-overlay/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, backgroundColor: item.color }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function ProgressPage() {
  const [range, setRange] = useState("3M");

  const startWeight = weightData[0].weight;
  const currentWeight = weightData[weightData.length - 1].weight;
  const totalLost = (startWeight - currentWeight).toFixed(1);
  const goalWeight = 80;
  const toGoal = (currentWeight - goalWeight).toFixed(1);

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-foreground">Progress</h1>
            <p className="text-sm text-muted mt-0.5">Track your fitness journey over time</p>
          </div>
          <div className="flex items-center gap-1 bg-overlay/5 border border-border/10 rounded-xl p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  range === r
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Current Weight"  value={`${currentWeight} kg`}  sub="Last updated today"  icon={Target}    color="#3b82f6" trend={-0.5} />
          <StatCard label="Total Lost"      value={`${totalLost} kg`}      sub="Since Jan 1"         icon={TrendingDown} color="#22c55e" />
          <StatCard label="Goal Weight"     value={`${goalWeight} kg`}     sub={`${toGoal} kg to go`} icon={Trophy}   color="#f97316" />
          <StatCard label="Active Streak"   value="18 days"                sub="Personal best: 21"   icon={Flame}    color="#ef4444" />
        </div>

        {/* Weight chart */}
        <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-black text-foreground">Weight Over Time</p>
              <p className="text-xs text-muted mt-0.5">
                Down <span className="text-green-400 font-bold">{totalLost} kg</span> in 12 weeks
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Weight</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-px border-t-2 border-dashed border-red-400 inline-block" /> Goal</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weightData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip content={<WeightTooltip />} />
              <ReferenceLine y={goalWeight} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
              <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2.5} fill="url(#wGrad)" dot={false} activeDot={{ r: 5, fill: "#3b82f6" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Body measurements + Strength */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Body Measurements */}
          <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Ruler size={16} className="text-primary" />
              <p className="text-sm font-black text-foreground">Body Measurements</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {bodyMeasurements.map((m) => (
                <div key={m.label} className="bg-overlay/5 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted font-semibold">{m.label}</span>
                    <span className={`text-[11px] font-bold ${
                      m.change < 0 ? "text-green-400" :
                      m.change > 0 ? "text-red-400" : "text-muted"
                    }`}>
                      {m.change < 0 ? m.change : m.change > 0 ? `+${m.change}` : "—"} cm
                    </span>
                  </div>
                  <p className="text-base font-black text-foreground">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strength Progress */}
          <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell size={16} className="text-primary" />
              <p className="text-sm font-black text-foreground">Strength Progress</p>
            </div>
            <div>
              {strengthData.map((item) => (
                <StrengthRow key={item.name} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-primary" />
            <p className="text-sm font-black text-foreground">Milestones Unlocked</p>
            <span className="ml-auto text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {milestones.length} achieved
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {milestones.map((m) => (
              <div
                key={m.title}
                className="flex items-center gap-3 bg-overlay/5 border border-border/10 rounded-2xl px-4 py-3 hover:border-primary/20 hover:bg-primary/5 transition-all"
              >
                <span className="text-2xl shrink-0">{m.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{m.title}</p>
                  <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <Calendar size={10} /> {m.date}
                  </p>
                </div>
                <ChevronRight size={14} className="text-muted shrink-0 ml-auto" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
