import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, BookmarkCheck, ChevronLeft, ChevronRight, X, Dumbbell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../../components/ui/input";
import ExerciseCard from "../../components/WorkoutLibrary/ExerciseCard";
import ExercisePopup from "../../components/WorkoutLibrary/ExercisePopup";
import { categories, categoryConfig, ITEMS_PER_PAGE } from "./workoutData";
import api from "../../lib/api";

gsap.registerPlugin(useGSAP);

const FALLBACK_IMG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80";
const CAL_MAP = { Cardio: 300, HIIT: 400, Strength: 200, Flexibility: 150 };

function normalizeExercise(ex) {
  return {
    id:           ex.id,
    name:         ex.name,
    category:     ex.category,
    level:        ex.difficulty
      ? ex.difficulty.charAt(0).toUpperCase() + ex.difficulty.slice(1)
      : "Beginner",
    img:          ex.img_url
      ? (ex.img_url.startsWith("http") ? ex.img_url : `${import.meta.env.VITE_BACKEND_URL}${ex.img_url}`)
      : FALLBACK_IMG,
    muscles:      ex.muscle_group
      ? ex.muscle_group.split(/[,·\/]+/).map((s) => s.trim()).filter(Boolean)
      : [ex.category],
    description:  ex.description || "A great exercise to include in your training.",
    duration:     ex.duration_mins ? `${ex.duration_mins} min` : "30–45 min",
    calories:     CAL_MAP[ex.category] ?? 200,
    type:         ex.category,
    duration_secs: ex.duration_secs ?? 45,
  };
}

export default function WorkoutLibrary() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [bookmarked,     setBookmarked]     = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentPage,    setCurrentPage]    = useState(1);
  const navigate     = useNavigate();
  const containerRef = useRef(null);

  const { data: rawExercises = [], isLoading } = useQuery({
    queryKey: ["exercises-library"],
    queryFn:  () => api.get("/exercises").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const exercises = rawExercises.map(normalizeExercise);

  useGSAP(
    () => {
      if (isLoading) return;
      gsap.fromTo(
        ".lib-row",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" }
      );
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  const toggleBookmark = (id) =>
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );

  const filtered = exercises.filter((ex) => {
    const matchCat    = activeCategory === "All" || ex.category === activeCategory;
    const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat) => { setActiveCategory(cat); setCurrentPage(1); };
  const handleSearch = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };

  return (
    <div ref={containerRef} className="space-y-6">

      {/* Header */}
      <div className="lib-row flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Workout Library</h1>
          <p className="text-sm text-muted mt-0.5">
            {isLoading ? "Loading…" : `${filtered.length} exercises available`}
          </p>
        </div>
        <AnimatePresence>
          {bookmarked.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-2 rounded-full hover:bg-primary/20 transition-colors"
            >
              <BookmarkCheck size={13} />
              {bookmarked.length} Saved
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="lib-row relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10" />
        <Input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-11 pr-10 py-5 h-12 bg-overlay/5 border-border/10 text-foreground placeholder:text-subtle focus-visible:ring-primary/30 focus-visible:border-primary/50 rounded-2xl"
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground/80"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Category filters */}
      <div className="lib-row flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon     = categoryConfig[cat]?.icon || Dumbbell;
          const isActive = activeCategory === cat;
          return (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-foreground shadow-md shadow-primary/20"
                  : "bg-overlay/5 border border-border/10 text-muted hover:text-foreground hover:bg-overlay/10"
              }`}
            >
              <Icon size={14} />
              {cat}
            </motion.button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${currentPage}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {paginated.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {paginated.map((ex, i) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    index={i}
                    onOpen={setSelectedExercise}
                    onBookmark={toggleBookmark}
                    bookmarked={bookmarked.includes(ex.id)}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-3"
              >
                <div className="w-16 h-16 rounded-2xl bg-overlay/5 border border-border/10 flex items-center justify-center">
                  <Search size={24} className="text-subtle" />
                </div>
                <p className="text-sm font-semibold text-muted">No exercises found</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="text-xs text-primary font-semibold hover:text-primary transition-colors"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="lib-row flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full border border-border/10 bg-overlay/5 flex items-center justify-center disabled:opacity-30 hover:bg-overlay/10 transition-colors"
          >
            <ChevronLeft size={16} className="text-muted" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                currentPage === i + 1
                  ? "bg-primary text-foreground shadow-md shadow-primary/20"
                  : "border border-border/10 bg-overlay/5 text-muted hover:bg-overlay/10"
              }`}
            >
              {i + 1}
            </motion.button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full border border-border/10 bg-overlay/5 flex items-center justify-center disabled:opacity-30 hover:bg-overlay/10 transition-colors"
          >
            <ChevronRight size={16} className="text-muted" />
          </button>
        </div>
      )}

      {/* Detail popup */}
      <AnimatePresence>
        {selectedExercise && (
          <ExercisePopup
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            onBookmark={toggleBookmark}
            bookmarked={bookmarked.includes(selectedExercise.id)}
            onStart={() => {
              navigate("/workouts/start", {
                state: {
                  dayData: {
                    day:      "Quick Workout",
                    category: selectedExercise.category,
                    exercises: [{
                      id:       selectedExercise.id,
                      name:     selectedExercise.name,
                      sets:     3,
                      reps:     null,
                      duration: selectedExercise.duration_secs ?? 45,
                      muscle:   selectedExercise.muscles?.[0] ?? selectedExercise.category,
                      img:      selectedExercise.img,
                    }],
                  },
                },
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
