import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Clock,
  Flame,
  Calendar,
  TrendingUp,
  CheckCircle2,
  X,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const historyData = [
  {
    id: 1,
    date: "Mar 21, 2026",
    dayLabel: "Today",
    name: "Upper Body Strength",
    type: "Strength",
    duration: 52,
    calories: 340,
    volume: "8,400 kg",
    sets: 18,
    completed: true,
    exercises: [
      { name: "Bench Press",        sets: 4, reps: "8×80kg"  },
      { name: "Incline DB Press",   sets: 3, reps: "10×30kg" },
      { name: "Cable Rows",         sets: 4, reps: "12×55kg" },
      { name: "Lat Pulldown",       sets: 3, reps: "12×60kg" },
      { name: "Overhead Press",     sets: 4, reps: "8×55kg"  },
    ],
  },
  {
    id: 2,
    date: "Mar 19, 2026",
    dayLabel: "2 days ago",
    name: "Leg Day",
    type: "Strength",
    duration: 65,
    calories: 480,
    volume: "14,200 kg",
    sets: 22,
    completed: true,
    exercises: [
      { name: "Back Squat",     sets: 5, reps: "5×110kg" },
      { name: "Romanian DL",   sets: 4, reps: "10×80kg"  },
      { name: "Leg Press",     sets: 4, reps: "12×180kg" },
      { name: "Leg Curl",      sets: 3, reps: "15×50kg"  },
      { name: "Calf Raises",   sets: 4, reps: "20×60kg"  },
      { name: "Leg Extension", sets: 3, reps: "15×55kg"  },
    ],
  },
  {
    id: 3,
    date: "Mar 17, 2026",
    dayLabel: "4 days ago",
    name: "HIIT Cardio",
    type: "Cardio",
    duration: 30,
    calories: 310,
    volume: "—",
    sets: 0,
    completed: true,
    exercises: [
      { name: "Burpees",        sets: 5, reps: "20 reps"  },
      { name: "Jump Squats",    sets: 5, reps: "15 reps"  },
      { name: "Mountain Climbers", sets: 5, reps: "30 sec" },
      { name: "Box Jumps",      sets: 4, reps: "12 reps"  },
    ],
  },
  {
    id: 4,
    date: "Mar 15, 2026",
    dayLabel: "6 days ago",
    name: "Push Day",
    type: "Strength",
    duration: 48,
    calories: 295,
    volume: "7,600 kg",
    sets: 16,
    completed: true,
    exercises: [
      { name: "Flat DB Press",   sets: 4, reps: "10×35kg" },
      { name: "Cable Fly",       sets: 3, reps: "15×20kg" },
      { name: "Tricep Pushdown", sets: 4, reps: "12×30kg" },
      { name: "Lateral Raises",  sets: 3, reps: "15×12kg" },
      { name: "Arnold Press",    sets: 3, reps: "10×22kg" },
    ],
  },
  {
    id: 5,
    date: "Mar 13, 2026",
    dayLabel: "8 days ago",
    name: "Pull Day",
    type: "Strength",
    duration: 55,
    calories: 360,
    volume: "9,100 kg",
    sets: 20,
    completed: true,
    exercises: [
      { name: "Deadlift",       sets: 4, reps: "5×130kg" },
      { name: "Barbell Row",    sets: 4, reps: "8×80kg"  },
      { name: "Pull-ups",       sets: 3, reps: "12 reps" },
      { name: "Face Pulls",     sets: 3, reps: "15×25kg" },
      { name: "Bicep Curls",    sets: 4, reps: "12×20kg" },
    ],
  },
  {
    id: 6,
    date: "Mar 10, 2026",
    dayLabel: "11 days ago",
    name: "Active Recovery",
    type: "Flexibility",
    duration: 25,
    calories: 95,
    volume: "—",
    sets: 0,
    completed: true,
    exercises: [
      { name: "Hip Flexor Stretch", sets: 3, reps: "60 sec" },
      { name: "Foam Rolling",       sets: 1, reps: "10 min" },
      { name: "Cat-Cow",            sets: 3, reps: "10 reps"},
      { name: "Child's Pose",       sets: 2, reps: "90 sec" },
    ],
  },
];

const TYPE_COLORS = {
  Strength:    { bg: "bg-primary/15",    text: "text-primary",    border: "border-primary/30"    },
  Cardio:      { bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/30"    },
  Flexibility: { bg: "bg-green-500/15",  text: "text-green-400",  border: "border-green-500/30"  },
  HIIT:        { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
};

const ALL_TYPES = ["All", "Strength", "Cardio", "Flexibility", "HIIT"];

// ─── Session Card ──────────────────────────────────────────────────────────────
function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TYPE_COLORS[session.type] || TYPE_COLORS.Strength;

  return (
    <div className={`bg-overlay/5 border rounded-2xl overflow-hidden transition-all ${
      expanded ? "border-primary/20" : "border-border/10"
    }`}>
      {/* Header row */}
      <button
        className="w-full flex items-start gap-4 p-4 sm:p-5 text-left hover:bg-overlay/5 transition-colors"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
          <Dumbbell size={18} className={cfg.text} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <p className="text-sm font-black text-foreground">{session.name}</p>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
              {session.type}
            </span>
            {session.completed && (
              <CheckCircle2 size={13} className="text-green-400" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1"><Calendar size={11} /> {session.date}</span>
            <span className="text-muted/40">·</span>
            <span className="text-foreground/50 text-[11px]">{session.dayLabel}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2.5">
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock size={11} className="text-primary" /> {session.duration} min
            </span>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Flame size={11} className="text-red-400" /> {session.calories} kcal
            </span>
            {session.sets > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <TrendingUp size={11} className="text-green-400" /> {session.sets} sets
              </span>
            )}
            {session.volume !== "—" && (
              <span className="text-xs text-muted font-semibold">{session.volume} vol</span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div className="shrink-0 mt-1">
          {expanded
            ? <ChevronUp size={16} className="text-muted" />
            : <ChevronDown size={16} className="text-muted" />}
        </div>
      </button>

      {/* Expanded exercises */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-border/5">
          <p className="text-xs font-black text-muted uppercase tracking-widest pt-4 pb-3">
            Exercises ({session.exercises.length})
          </p>
          <div className="space-y-2">
            {session.exercises.map((ex, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-overlay/5 hover:bg-overlay/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                    {i + 1}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{ex.name}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted">{ex.sets} sets</span>
                  <span className="text-muted/40">·</span>
                  <span className="font-bold text-foreground/80">{ex.reps}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Summary strip ─────────────────────────────────────────────────────────────
function SummaryStrip() {
  const totalSessions = historyData.length;
  const totalMins     = historyData.reduce((a, s) => a + s.duration, 0);
  const totalCals     = historyData.reduce((a, s) => a + s.calories, 0);
  const totalSets     = historyData.reduce((a, s) => a + s.sets, 0);

  const stats = [
    { label: "Sessions",  value: totalSessions,               icon: Dumbbell,  color: "#3b82f6" },
    { label: "Minutes",   value: totalMins,                   icon: Clock,     color: "#a855f7" },
    { label: "Calories",  value: `${totalCals.toLocaleString()} kcal`, icon: Flame, color: "#ef4444" },
    { label: "Total Sets",value: totalSets,                   icon: TrendingUp,color: "#22c55e" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-overlay/5 border border-border/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "22" }}>
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <p className="text-base font-black text-foreground">{value}</p>
            <p className="text-[11px] text-muted">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function WorkoutHistory() {
  const [search, setSearch]     = useState("");
  const [typeFilter, setType]   = useState("All");

  const filtered = historyData.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "All" || s.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-foreground">Workout History</h1>
          <p className="text-sm text-muted mt-0.5">All your past training sessions in one place</p>
        </div>

        {/* Summary */}
        <SummaryStrip />

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-overlay/5 border border-border/10 text-foreground placeholder-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground/80">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Type filter pills */}
          <div className="flex items-center gap-1.5 bg-overlay/5 border border-border/10 rounded-xl px-2 py-1.5">
            <Filter size={13} className="text-muted shrink-0 ml-1" />
            {ALL_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  typeFilter === t
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Session list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Dumbbell size={32} className="text-subtle" />
            <p className="text-sm font-semibold text-muted">No sessions found</p>
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-primary font-bold hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-xs text-muted pb-2">
            Showing {filtered.length} of {historyData.length} sessions
          </p>
        )}
      </div>
    </div>
  );
}
