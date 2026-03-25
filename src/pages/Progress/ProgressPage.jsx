import { useState } from "react";
import {
  TrendingUp, TrendingDown, Minus, Trophy, Flame,
  Dumbbell, Ruler, ChevronRight, Star, Target, Calendar, Plus, X,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

const RANGE_MAP = { "1M": "30d", "3M": "90d", "6M": "180d", "1Y": "365d" };
const RANGES    = ["1M", "3M", "6M", "1Y"];

const STRENGTH_COLORS = ["#3b82f6", "#a855f7", "#f97316", "#22c55e", "#06b6d4", "#ef4444", "#eab308"];

const MEASUREMENT_FIELDS = [
  { key: "chest_cm",  label: "Chest"  },
  { key: "waist_cm",  label: "Waist"  },
  { key: "hips_cm",   label: "Hips"   },
  { key: "thighs_cm", label: "Thighs" },
  { key: "arms_cm",   label: "Arms"   },
  { key: "neck_cm",   label: "Neck"   },
];

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
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "22" }}>
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
  const pct      = item.start > 0 ? Math.round(((item.current - item.start) / item.start) * 100) : 0;
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
            {pct > 0 && (
              <span className="text-[11px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded-full">
                +{pct}%
              </span>
            )}
          </div>
        </div>
        <div className="h-1.5 bg-overlay/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, backgroundColor: item.color }} />
        </div>
      </div>
    </div>
  );
}

// ─── Measurements Modal ────────────────────────────────────────────────────────
function MeasurementsModal({ current, onClose, onSave }) {
  const [form, setForm] = useState({
    chest_cm:  current?.chest_cm  ?? "",
    waist_cm:  current?.waist_cm  ?? "",
    hips_cm:   current?.hips_cm   ?? "",
    thighs_cm: current?.thighs_cm ?? "",
    arms_cm:   current?.arms_cm   ?? "",
    neck_cm:   current?.neck_cm   ?? "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-foreground">Update Measurements</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-overlay/10 flex items-center justify-center hover:bg-overlay/20 transition-colors">
            <X size={15} className="text-muted" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MEASUREMENT_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs font-bold text-muted uppercase tracking-wider">{label} (cm)</label>
              <input
                type="number" min={0} step={0.1}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder="—"
                className="mt-1 w-full bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors">Cancel</button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-3 bg-primary rounded-2xl text-sm font-bold text-foreground transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Strength Modal ────────────────────────────────────────────────────────────
function StrengthModal({ onClose, onSave }) {
  const [form, setForm] = useState({ exercise_name: "", weight_value: "", unit: "kg" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-foreground">Log Strength</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-overlay/10 flex items-center justify-center hover:bg-overlay/20 transition-colors">
            <X size={15} className="text-muted" />
          </button>
        </div>
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider">Exercise</label>
          <input
            type="text" value={form.exercise_name}
            onChange={(e) => setForm((p) => ({ ...p, exercise_name: e.target.value }))}
            placeholder="e.g. Bench Press"
            className="mt-1 w-full bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Value</label>
            <input
              type="number" min={0} step={0.5} value={form.weight_value}
              onChange={(e) => setForm((p) => ({ ...p, weight_value: e.target.value }))}
              placeholder="0"
              className="mt-1 w-full bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Unit</label>
            <select value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
              className="mt-1 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
              <option className="bg-elevated">kg</option>
              <option className="bg-elevated">lbs</option>
              <option className="bg-elevated">reps</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors">Cancel</button>
          <button
            onClick={() => { if (form.exercise_name && form.weight_value) { onSave(form); onClose(); } }}
            disabled={!form.exercise_name || !form.weight_value}
            className="flex-1 py-3 bg-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl text-sm font-bold text-foreground transition-colors"
          >
            Log
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function ProgressPage() {
  const [range,          setRange]          = useState("3M");
  const [showMeasModal,  setShowMeasModal]  = useState(false);
  const [showStrModal,   setShowStrModal]   = useState(false);
  const queryClient = useQueryClient();

  const { data: rawWeightHistory = [] } = useQuery({
    queryKey: ["weight-history", range],
    queryFn: () => api.get(`/user/weight-history?range=${RANGE_MAP[range]}`).then((r) => r.data),
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((r) => r.data),
  });

  const { data: historySummary } = useQuery({
    queryKey: ["workout-history-summary"],
    queryFn: () => api.get("/workouts/history/summary").then((r) => r.data),
  });

  const { data: dashSummary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => api.get("/dashboard/summary").then((r) => r.data),
  });

  const { data: measurements } = useQuery({
    queryKey: ["progress-measurements"],
    queryFn: () => api.get("/progress/measurements").then((r) => r.data),
  });

  const { data: strengthData = [] } = useQuery({
    queryKey: ["progress-strength"],
    queryFn: () => api.get("/progress/strength").then((r) => r.data),
  });

  const { data: milestones = [] } = useQuery({
    queryKey: ["progress-milestones"],
    queryFn: () => api.get("/progress/milestones").then((r) => r.data),
  });

  const saveMeasurements = useMutation({
    mutationFn: (data) => api.post("/progress/measurements", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress-measurements"] }),
  });

  const logStrength = useMutation({
    mutationFn: (data) => api.post("/progress/strength", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress-strength"] });
      queryClient.invalidateQueries({ queryKey: ["progress-milestones"] });
    },
  });

  const weightData    = rawWeightHistory.map((d) => ({ date: d.day, weight: d.weight_kg ?? d.weight }));
  const startWeight   = weightData.length ? weightData[0].weight : null;
  const currentWeight = weightData.length ? weightData[weightData.length - 1].weight : null;
  const totalLost     = startWeight && currentWeight ? (startWeight - currentWeight).toFixed(1) : "—";
  const goalWeight    = profileData?.profile?.goal_weight_kg ?? 80;
  const toGoal        = currentWeight ? (currentWeight - goalWeight).toFixed(1) : "—";

  // Build body measurement display from API data
  const cur  = measurements?.current;
  const prev = measurements?.previous;
  const bodyMeasurements = MEASUREMENT_FIELDS.map(({ key, label }) => {
    const val    = cur?.[key];
    const oldVal = prev?.[key];
    const change = val != null && oldVal != null ? +(val - oldVal).toFixed(1) : null;
    return { label, value: val != null ? `${val} cm` : "—", change };
  });

  // Attach colors to strength data
  const coloredStrength = strengthData.map((s, i) => ({
    ...s,
    color: STRENGTH_COLORS[i % STRENGTH_COLORS.length],
  }));

  // Format milestone dates
  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

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
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  range === r ? "bg-primary text-primary-foreground shadow" : "text-muted hover:text-foreground"
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Current Weight" value={currentWeight ? `${currentWeight} kg` : "—"} sub="Last recorded" icon={Target} color="#3b82f6"
            trend={weightData.length >= 2 ? +(currentWeight - weightData[weightData.length - 2].weight).toFixed(1) : undefined} />
          <StatCard label="Total Lost"    value={totalLost !== "—" ? `${totalLost} kg` : "—"} sub={`Over ${range}`} icon={TrendingDown} color="#22c55e" />
          <StatCard label="Goal Weight"   value={`${goalWeight} kg`} sub={toGoal !== "—" ? `${toGoal} kg to go` : "Set in profile"} icon={Trophy} color="#f97316" />
          <StatCard label="Active Streak" value={dashSummary?.streak ? `${dashSummary.streak} days` : "—"} sub={`${historySummary?.totalSessions ?? 0} sessions total`} icon={Flame} color="#ef4444" />
        </div>

        {/* Weight chart */}
        <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-black text-foreground">Weight Over Time</p>
              <p className="text-xs text-muted mt-0.5">
                {totalLost !== "—" && Number(totalLost) > 0
                  ? <>Down <span className="text-green-400 font-bold">{totalLost} kg</span> in this period</>
                  : "Weight trend over selected period"}
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
              <button onClick={() => setShowMeasModal(true)}
                className="ml-auto flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors">
                <Plus size={11} /> Update
              </button>
            </div>
            {cur ? (
              <div className="grid grid-cols-2 gap-3">
                {bodyMeasurements.map((m) => (
                  <div key={m.label} className="bg-overlay/5 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted font-semibold">{m.label}</span>
                      {m.change !== null && (
                        <span className={`text-[11px] font-bold ${
                          m.change < 0 ? "text-green-400" : m.change > 0 ? "text-red-400" : "text-muted"
                        }`}>
                          {m.change > 0 ? `+${m.change}` : m.change} cm
                        </span>
                      )}
                    </div>
                    <p className="text-base font-black text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <p className="text-xs text-muted">No measurements logged yet</p>
                <button onClick={() => setShowMeasModal(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-2 rounded-xl hover:bg-primary/20 transition-colors">
                  <Plus size={12} /> Log First Measurement
                </button>
              </div>
            )}
          </div>

          {/* Strength Progress */}
          <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell size={16} className="text-primary" />
              <p className="text-sm font-black text-foreground">Strength Progress</p>
              <button onClick={() => setShowStrModal(true)}
                className="ml-auto flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors">
                <Plus size={11} /> Log
              </button>
            </div>
            {coloredStrength.length > 0 ? (
              coloredStrength.map((item) => <StrengthRow key={item.name} item={item} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <p className="text-xs text-muted">No strength data logged yet</p>
                <button onClick={() => setShowStrModal(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-2 rounded-xl hover:bg-primary/20 transition-colors">
                  <Plus size={12} /> Log First PR
                </button>
              </div>
            )}
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
          {milestones.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {milestones.map((m, i) => (
                <div key={i}
                  className="flex items-center gap-3 bg-overlay/5 border border-border/10 rounded-2xl px-4 py-3 hover:border-primary/20 hover:bg-primary/5 transition-all">
                  <span className="text-2xl shrink-0">{m.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{m.title}</p>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <Calendar size={10} /> {formatDate(m.date)}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted shrink-0 ml-auto" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-muted py-8">
              Complete workouts, log weight, and track strength to unlock milestones.
            </p>
          )}
        </div>

      </div>

      {showMeasModal && (
        <MeasurementsModal
          current={measurements?.current}
          onClose={() => setShowMeasModal(false)}
          onSave={(data) => saveMeasurements.mutate(data)}
        />
      )}

      {showStrModal && (
        <StrengthModal
          onClose={() => setShowStrModal(false)}
          onSave={(data) => logStrength.mutate(data)}
        />
      )}
    </div>
  );
}
