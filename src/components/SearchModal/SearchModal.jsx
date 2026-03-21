import { useState, useEffect, useRef } from "react";
import { Search, X, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { exercises, categories, categoryConfig, levelColor } from "../../pages/WorkoutLibrary/workoutData";

const catColor = {
  Cardio:   "bg-red-500/15 text-red-400 border border-red-500/20",
  Strength: "bg-primary/15 text-primary border border-primary/20",
  HIIT:     "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  Yoga:     "bg-green-500/15 text-green-400 border border-green-500/20",
};

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = query.trim().length > 0
    ? exercises.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase()) ||
        ex.category.toLowerCase().includes(query.toLowerCase()) ||
        ex.muscles?.some((m) => m.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 7)
    : [];

  const handleSelect = () => {
    navigate("/workouts");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-surface border border-border/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-10">

        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/10">
          <Search size={16} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workouts, categories, muscles…"
            className="flex-1 bg-transparent text-foreground placeholder-gray-600 text-sm focus:outline-none"
          />
          <div className="flex items-center gap-2 shrink-0">
            <kbd className="hidden sm:flex text-[10px] font-bold text-subtle bg-overlay/5 border border-border/10 rounded px-1.5 py-0.5">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-overlay/5 hover:bg-overlay/15 flex items-center justify-center transition-colors"
            >
              <X size={12} className="text-muted" />
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="divide-y divide-border/5 max-h-[420px] overflow-y-auto">
            {results.map((ex) => (
              <button
                key={ex.id}
                onClick={handleSelect}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-overlay/5 transition-colors text-left group"
              >
                {ex.img
                  ? <img src={ex.img} alt={ex.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                  : (
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Dumbbell size={16} className="text-primary" />
                    </div>
                  )
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {ex.name}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {ex.duration} · {ex.calories} kcal · {ex.muscles?.slice(0, 2).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor[ex.category] ?? "bg-overlay/10 text-muted"}`}>
                    {ex.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColor[ex.level] ?? ""}`}>
                    {ex.level}
                  </span>
                </div>
              </button>
            ))}
            <div className="px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs text-subtle">{results.length} result{results.length !== 1 ? "s" : ""}</p>
              <button
                onClick={handleSelect}
                className="text-xs font-semibold text-primary hover:text-primary transition-colors"
              >
                View all in library →
              </button>
            </div>
          </div>
        ) : query.trim() ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-overlay/5 border border-border/10 flex items-center justify-center">
              <Search size={18} className="text-subtle" />
            </div>
            <p className="text-sm font-bold text-muted">No workouts found</p>
            <p className="text-xs text-subtle">Try "{query.trim()}" in a different way</p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-3">
            <p className="text-[10px] font-black text-subtle uppercase tracking-widest">Browse by category</p>
            <div className="flex gap-2 flex-wrap">
              {categories.filter((c) => c !== "All").map((cat) => {
                const Cfg  = categoryConfig[cat];
                const Icon = Cfg?.icon ?? Dumbbell;
                return (
                  <button
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${catColor[cat] ?? "bg-overlay/5 border-border/10 text-muted"}`}
                  >
                    <Icon size={11} />
                    {cat}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] font-black text-subtle uppercase tracking-widest pt-1">Popular</p>
            <div className="divide-y divide-border/5">
              {exercises.slice(0, 4).map((ex) => (
                <button
                  key={ex.id}
                  onClick={handleSelect}
                  className="w-full flex items-center gap-3 py-2.5 hover:bg-overlay/5 transition-colors text-left group rounded-xl px-2"
                >
                  {ex.img && (
                    <img src={ex.img} alt={ex.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">{ex.name}</p>
                    <p className="text-[10px] text-subtle">{ex.category} · {ex.level}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
