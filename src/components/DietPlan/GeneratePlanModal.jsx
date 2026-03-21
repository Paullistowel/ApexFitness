import { useState, useEffect, useRef } from "react";
import { X, CalendarDays, LayoutGrid, Leaf, Zap, Dumbbell, Minus, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SCOPES = [
  {
    key: "today",
    label: "Today",
    sub: "Replace today's meals",
    Icon: CalendarDays,
  },
  {
    key: "week",
    label: "Full Week",
    sub: "Replace all 7 days",
    Icon: LayoutGrid,
  },
];

const PREFERENCES = [
  { key: "Standard",     label: "Standard",     sub: "Balanced macros",       Icon: CalendarDays },
  { key: "Vegan",        label: "Vegan",         sub: "Plant-based meals",     Icon: Leaf         },
  { key: "Keto",         label: "Keto",          sub: "Low carb, high fat",    Icon: Zap          },
  { key: "High-Protein", label: "High Protein",  sub: "Muscle building focus", Icon: Dumbbell     },
];

const PRESETS = [1500, 2000, 2500];
const CAL_MIN = 1200;
const CAL_MAX = 3500;

export default function GeneratePlanModal({ onGenerate, onClose }) {
  const [scope,      setScope]      = useState("today");
  const [preference, setPreference] = useState("Standard");
  const [calories,   setCalories]   = useState(2000);
  const [loading,    setLoading]    = useState(false);
  const timerRef = useRef(null);

  // Cleanup timeout on unmount to prevent state update on unmounted component
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const calPct = ((calories - CAL_MIN) / (CAL_MAX - CAL_MIN)) * 100;

  const decrement = () => setCalories((c) => Math.max(CAL_MIN, c - 50));
  const increment = () => setCalories((c) => Math.min(CAL_MAX, c + 50));

  const handleGenerate = () => {
    setLoading(true);
    timerRef.current = setTimeout(() => {
      onGenerate({ scope, preference, calories });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!loading ? onClose : undefined}
      />

      {/* Panel */}
      <motion.div
        className="relative bg-elevated border border-border/10 rounded-3xl w-full max-w-lg shadow-2xl z-10 overflow-hidden"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-white/8">
          <div>
            <h3 className="text-lg font-black text-foreground">Generate New Plan</h3>
            <p className="text-xs text-muted mt-0.5">Customize your nutrition preferences</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-overlay/5 border border-border/10 flex items-center justify-center hover:bg-overlay/10 transition-colors shrink-0 mt-0.5 disabled:opacity-40"
          >
            <X size={15} className="text-muted" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">

          {/* ── Section 1: Scope ── */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Apply To</p>
            <div className="grid grid-cols-2 gap-3">
              {SCOPES.map(({ key, label, sub, Icon }) => {
                const active = scope === key;
                return (
                  <button
                    key={key}
                    onClick={() => setScope(key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                      active
                        ? "border-primary/50 bg-primary/10"
                        : "bg-overlay/5 border-border/10 hover:border-border/20"
                    }`}
                  >
                    <Icon
                      size={22}
                      className={active ? "text-primary" : "text-muted"}
                    />
                    <div>
                      <p className={`text-sm font-bold ${active ? "text-foreground" : "text-muted"}`}>{label}</p>
                      <p className="text-[11px] text-subtle mt-0.5">{sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Section 2: Diet Preference ── */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Diet Preference</p>
            <div className="grid grid-cols-2 gap-3">
              {PREFERENCES.map(({ key, label, sub, Icon }) => {
                const active = preference === key;
                return (
                  <button
                    key={key}
                    onClick={() => setPreference(key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                      active
                        ? "border-primary/50 bg-primary/10"
                        : "bg-overlay/5 border-border/10 hover:border-border/20"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={active ? "text-primary" : "text-muted"}
                    />
                    <div>
                      <p className={`text-sm font-bold ${active ? "text-foreground" : "text-muted"}`}>{label}</p>
                      <p className="text-[11px] text-subtle mt-0.5">{sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Section 3: Calorie Target ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Daily Calorie Target</p>

            {/* Counter */}
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={decrement}
                className="w-10 h-10 rounded-full bg-overlay/10 hover:bg-overlay/15 border border-border/10 flex items-center justify-center transition-colors"
              >
                <Minus size={16} className="text-foreground/80" />
              </button>

              <div className="text-center min-w-[120px]">
                <p className="text-4xl font-black text-foreground tabular-nums">
                  {calories.toLocaleString()}
                </p>
                <p className="text-sm text-muted mt-0.5">kcal</p>
              </div>

              <button
                onClick={increment}
                className="w-10 h-10 rounded-full bg-overlay/10 hover:bg-overlay/15 border border-border/10 flex items-center justify-center transition-colors"
              >
                <Plus size={16} className="text-foreground/80" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-overlay/8 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${calPct}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-700 font-semibold -mt-1">
              <span>{CAL_MIN.toLocaleString()} kcal</span>
              <span>{CAL_MAX.toLocaleString()} kcal</span>
            </div>

            {/* Preset chips */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCalories(preset)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    calories === preset
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-overlay/5 border-border/10 text-muted hover:text-foreground/80"
                  }`}
                >
                  {preset.toLocaleString()} kcal
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-6 pt-4 border-t border-white/8">
          <motion.button
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary disabled:opacity-80 text-foreground font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating…
              </>
            ) : (
              "Generate Plan"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
