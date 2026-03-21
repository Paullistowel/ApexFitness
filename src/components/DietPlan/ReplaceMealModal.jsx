import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mealAlternatives } from "../../pages/DietPlan/dietPlanData";

const FILTERS = ["All", "Low Cal", "High Protein", "Vegan", "Keto"];

const TAG_STYLES = {
  "Vegan":        "bg-green-500/15 text-green-400 border border-green-500/20",
  "Keto":         "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  "High Protein": "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  "Low Cal":      "bg-sky-500/15 text-sky-400 border border-sky-500/20",
  "High Carb":    "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  "Balanced":     "bg-gray-500/15 text-muted border border-gray-500/20",
};

export default function ReplaceMealModal({ mealLabel, mealId, onConfirm, onClose }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected]         = useState(null);

  const pool = mealAlternatives[mealId] ?? [];

  const filtered =
    activeFilter === "All"
      ? pool
      : pool.filter((opt) => opt.tags.includes(activeFilter));

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative bg-elevated border border-border/10 rounded-3xl w-full max-w-xl shadow-2xl z-10 flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-white/8">
          <div>
            <h3 className="text-lg font-black text-foreground">Replace {mealLabel}</h3>
            <p className="text-xs text-muted mt-0.5">Pick an alternative for this meal</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-overlay/5 border border-border/10 flex items-center justify-center hover:bg-overlay/10 transition-colors shrink-0 mt-0.5"
          >
            <X size={15} className="text-muted" />
          </button>
        </div>

        {/* ── Filter chips ── */}
        <div className="flex items-center gap-2 px-6 py-3 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                activeFilter === f
                  ? "bg-primary/15 border border-primary/30 text-primary"
                  : "bg-overlay/5 border border-border/10 text-muted hover:text-foreground/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Meal grid ── */}
        <div className="px-6 pb-3 overflow-y-auto max-h-[340px]">
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((opt, i) => {
                const isSelected = selected?.id === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.18 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelected(isSelected ? null : opt)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "ring-2 ring-primary border-primary/50 bg-primary/8"
                        : "bg-overlay/5 border-border/10 hover:border-primary/40 hover:bg-primary/5"
                    } cursor-pointer`}
                  >
                    {/* Top row: emoji + calorie badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-3xl leading-none">{opt.emoji}</span>
                      <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                        {opt.calories} kcal
                      </span>
                    </div>

                    {/* Name */}
                    <p className="text-sm font-bold text-foreground mt-2 leading-snug">{opt.name}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {opt.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TAG_STYLES[tag] ?? "bg-gray-500/15 text-muted border border-gray-500/20"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-xs text-subtle py-8">No options match this filter.</p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-6 pt-3 border-t border-white/8 space-y-3">
          {/* Item breakdown preview */}
          {selected ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-subtle mb-1">Breakdown</p>
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-xs text-muted">{item.name}</span>
                  <span className="text-xs text-subtle">{item.kcal} kcal</span>
                </div>
              ))}
            </motion.div>
          ) : (
            <p className="text-xs text-subtle text-center">Select a meal above to preview it</p>
          )}

          <motion.button
            whileHover={{ scale: selected ? 1.02 : 1 }}
            whileTap={{ scale: selected ? 0.97 : 1 }}
            onClick={handleConfirm}
            disabled={!selected}
            className={`w-full py-3 rounded-2xl text-sm font-bold transition-all ${
              selected
                ? "bg-primary hover:bg-primary text-foreground"
                : "bg-overlay/5 text-subtle cursor-not-allowed border border-border/10"
            }`}
          >
            Confirm Swap
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
