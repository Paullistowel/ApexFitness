import { useState, useEffect, useRef } from "react";
import { Search, X, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const catColor = {
  Cardio:      "bg-red-500/15 text-red-400 border border-red-500/20",
  Strength:    "bg-primary/15 text-primary border border-primary/20",
  HIIT:        "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  Flexibility: "bg-green-500/15 text-green-400 border border-green-500/20",
};
const levelColor = {
  beginner:     "bg-green-500/15 text-green-400 border border-green-500/20",
  intermediate: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  advanced:     "bg-red-500/15 text-red-400 border border-red-500/20",
};

function normalizeImg(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BACKEND}${url}`;
}

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

  const { data: allExercises = [] } = useQuery({
    queryKey: ["exercises-search"],
    queryFn: () => api.get("/exercises").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const categories = [...new Set(allExercises.map((e) => e.category))];

  const results = query.trim().length > 0
    ? allExercises.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase()) ||
        ex.category.toLowerCase().includes(query.toLowerCase()) ||
        ex.muscle_group?.toLowerCase().includes(query.toLowerCase())
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
            <button onClick={onClose} className="w-6 h-6 rounded-full bg-overlay/5 hover:bg-overlay/15 flex items-center justify-center transition-colors">
              <X size={12} className="text-muted" />
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="divide-y divide-border/5 max-h-[420px] overflow-y-auto">
            {results.map((ex) => {
              const img = normalizeImg(ex.img_url);
              return (
                <button key={ex.id} onClick={handleSelect}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-overlay/5 transition-colors text-left group">
                  {img
                    ? <img src={img} alt={ex.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    : <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Dumbbell size={16} className="text-primary" /></div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{ex.name}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {ex.duration_mins ? `${ex.duration_mins} min` : "—"} · {ex.muscle_group ?? "General"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor[ex.category] ?? "bg-overlay/10 text-muted border-border/10"}`}>
                      {ex.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${levelColor[ex.difficulty] ?? "bg-overlay/10 text-muted border-border/10"}`}>
                      {ex.difficulty}
                    </span>
                  </div>
                </button>
              );
            })}
            <div className="px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs text-subtle">{results.length} result{results.length !== 1 ? "s" : ""}</p>
              <button onClick={handleSelect} className="text-xs font-semibold text-primary hover:text-primary transition-colors">
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
              {categories.map((cat) => (
                <button key={cat} onClick={() => setQuery(cat)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${catColor[cat] ?? "bg-overlay/5 border-border/10 text-muted"}`}>
                  <Dumbbell size={11} />
                  {cat}
                </button>
              ))}
            </div>
            {allExercises.length > 0 && (
              <>
                <p className="text-[10px] font-black text-subtle uppercase tracking-widest pt-1">Popular</p>
                <div className="divide-y divide-border/5">
                  {allExercises.slice(0, 4).map((ex) => {
                    const img = normalizeImg(ex.img_url);
                    return (
                      <button key={ex.id} onClick={handleSelect}
                        className="w-full flex items-center gap-3 py-2.5 hover:bg-overlay/5 transition-colors text-left group rounded-xl px-2">
                        {img
                          ? <img src={img} alt={ex.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          : <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Dumbbell size={13} className="text-primary" /></div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">{ex.name}</p>
                          <p className="text-[10px] text-subtle">{ex.category} · {ex.difficulty}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
