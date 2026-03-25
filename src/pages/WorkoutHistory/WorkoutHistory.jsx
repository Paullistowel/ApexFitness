import { useState } from "react";
import {
  Search, Filter, ChevronDown, ChevronUp,
  Dumbbell, Clock, Flame, Calendar, TrendingUp, CheckCircle2, X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

const TYPE_COLORS = {
  Strength:    { bg: "bg-primary/15",    text: "text-primary",    border: "border-primary/30"    },
  Cardio:      { bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/30"    },
  Flexibility: { bg: "bg-green-500/15",  text: "text-green-400",  border: "border-green-500/30"  },
  HIIT:        { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
};

const ALL_TYPES = ["All", "Strength", "Cardio", "Flexibility", "HIIT"];

function formatDate(dateStr) {
  const d    = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  const label = diff === 0 ? "Today" : diff === 1 ? "Yesterday" : `${diff} days ago`;
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    dayLabel: label,
  };
}

// ─── Session Card ──────────────────────────────────────────────────────────────
function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TYPE_COLORS[session.type] || TYPE_COLORS.Strength;
  const { date, dayLabel } = formatDate(session.started_at);

  return (
    <div className={`bg-overlay/5 border rounded-2xl overflow-hidden transition-all ${expanded ? "border-primary/20" : "border-border/10"}`}>
      <button
        className="w-full flex items-start gap-4 p-4 sm:p-5 text-left hover:bg-overlay/5 transition-colors"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
          <Dumbbell size={18} className={cfg.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <p className="text-sm font-black text-foreground">{session.name}</p>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
              {session.type}
            </span>
            <CheckCircle2 size={13} className="text-green-400" />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1"><Calendar size={11} /> {date}</span>
            <span className="text-muted/40">·</span>
            <span className="text-foreground/50 text-[11px]">{dayLabel}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2.5">
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock size={11} className="text-primary" /> {session.duration_mins} min
            </span>
            {session.calories_burned > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <Flame size={11} className="text-red-400" /> {session.calories_burned} kcal
              </span>
            )}
            {session.exercises?.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <TrendingUp size={11} className="text-green-400" /> {session.exercises.reduce((a, e) => a + (e.sets || 0), 0)} sets
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 mt-1">
          {expanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
        </div>
      </button>

      {expanded && session.exercises?.length > 0 && (
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
                  <p className="text-sm font-semibold text-foreground">{ex.exercise_name}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted">{ex.sets} sets</span>
                  {ex.reps_display && <><span className="text-muted/40">·</span><span className="font-bold text-foreground/80">{ex.reps_display}</span></>}
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
function SummaryStrip({ data }) {
  const stats = [
    { label: "Sessions",   value: data?.totalSessions ?? "—",                                          icon: Dumbbell,   color: "#3b82f6" },
    { label: "Minutes",    value: data?.totalMins     ?? "—",                                          icon: Clock,      color: "#a855f7" },
    { label: "Calories",   value: data?.totalCalories ? `${data.totalCalories.toLocaleString()} kcal` : "—", icon: Flame, color: "#ef4444" },
    { label: "Total Sets", value: data?.totalSets     ?? "—",                                          icon: TrendingUp, color: "#22c55e" },
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
  const [search, setSearch]   = useState("");
  const [typeFilter, setType] = useState("All");

  const { data: summaryData } = useQuery({
    queryKey: ["workout-history-summary"],
    queryFn: () => api.get("/workouts/history/summary").then((r) => r.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["workout-history", search, typeFilter],
    queryFn: () => {
      const params = new URLSearchParams({ limit: 50 });
      if (search) params.set("search", search);
      if (typeFilter !== "All") params.set("type", typeFilter);
      return api.get(`/workouts/history?${params}`).then((r) => r.data);
    },
  });

  const sessions = data?.sessions ?? [];
  const total    = data?.total    ?? 0;

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">

        <div>
          <h1 className="text-xl font-black text-foreground">Workout History</h1>
          <p className="text-sm text-muted mt-0.5">All your past training sessions in one place</p>
        </div>

        <SummaryStrip data={summaryData} />

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
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
          <div className="flex items-center gap-1.5 bg-overlay/5 border border-border/10 rounded-xl px-2 py-1.5">
            <Filter size={13} className="text-muted shrink-0 ml-1" />
            {ALL_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  typeFilter === t ? "bg-primary text-primary-foreground shadow" : "text-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Session list */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
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
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}

        {sessions.length > 0 && (
          <p className="text-center text-xs text-muted pb-2">
            Showing {sessions.length} of {total} sessions
          </p>
        )}
      </div>
    </div>
  );
}
