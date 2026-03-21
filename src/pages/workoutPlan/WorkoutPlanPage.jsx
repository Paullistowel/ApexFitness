import { useState, useRef } from "react";
import { CalendarDays, Clock, Dumbbell, Pencil, X, Search, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import WeekStrip from "../../components/WorkoutPlan/WeekStrip";
import DayDetail from "../../components/WorkoutPlan/DayDetail";
import AccordionDay from "../../components/WorkoutPlan/AccordionDay";
import EditExerciseModal from "../../components/WorkoutPlan/EditExerciseModal";
import { initialPlan } from "./workoutPlanData";
import { exercises as exerciseLibrary } from "../WorkoutLibrary/workoutData";

gsap.registerPlugin(useGSAP);

/* ─── AddExerciseModal ──────────────────────────────────────────────── */
function AddExerciseModal({ targetDay, onAdd, onClose }) {
  const [query, setQuery] = useState("");

  const filtered = exerciseLibrary.filter((ex) =>
    ex.name.toLowerCase().includes(query.toLowerCase()) ||
    ex.category.toLowerCase().includes(query.toLowerCase())
  );

  const categoryChipColor = {
    Cardio:   "bg-red-500/15 text-red-400 border border-red-500/30",
    Strength: "bg-primary/15 text-primary border border-primary/30",
    HIIT:     "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    Yoga:     "bg-green-500/15 text-green-400 border border-green-500/30",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-elevated border border-border/10 rounded-2xl w-full max-w-md mx-4 flex flex-col max-h-[80vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/10 shrink-0">
          <div>
            <h2 className="text-sm font-black text-foreground">Add Exercise</h2>
            <p className="text-xs text-muted mt-0.5">to {targetDay}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-overlay/5 hover:bg-overlay/10 border border-border/10 flex items-center justify-center transition-colors"
          >
            <X size={13} className="text-muted" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-border/10 shrink-0">
          <div className="flex items-center gap-2 bg-overlay/5 border border-border/10 rounded-xl px-3 py-2">
            <Search size={13} className="text-muted shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exercises…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder-gray-600 outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 divide-y divide-border/5">
          {filtered.length === 0 ? (
            <p className="text-xs text-subtle text-center py-8">No exercises found.</p>
          ) : (
            filtered.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-overlay/5 transition-colors"
              >
                <img
                  src={ex.img}
                  alt={ex.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{ex.name}</p>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                      categoryChipColor[ex.category] ?? "bg-overlay/10 text-muted"
                    }`}
                  >
                    {ex.category}
                  </span>
                </div>
                <button
                  onClick={() => onAdd(ex)}
                  className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl hover:bg-green-500/20 transition-colors shrink-0"
                >
                  <Plus size={12} />
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── WorkoutPlanPage ───────────────────────────────────────────────── */
export default function WorkoutPlanPage() {
  const [plan, setPlan]           = useState(initialPlan);
  const [activeDay, setActiveDay] = useState("Friday");
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingDay, setEditingDay]           = useState(null);
  const [view, setView]           = useState("week");
  const [isEditing, setIsEditing] = useState(false);
  const [addExModal, setAddExModal] = useState(null); // null | dayName string
  const containerRef = useRef(null);
  const savedPlan    = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".plan-row",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const activeDayData = plan.find((d) => d.day === activeDay);

  /* ── Edit mode entry / exit ── */
  const handleEnterEdit = () => {
    savedPlan.current = JSON.parse(JSON.stringify(plan));
    setView("list");
    setIsEditing(true);
  };

  const handleSavePlan = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setPlan(savedPlan.current);
    setIsEditing(false);
  };

  /* ── Exercise CRUD ── */
  const handleSaveExercise = (updated) => {
    setPlan((prev) =>
      prev.map((d) =>
        d.day === editingDay
          ? { ...d, exercises: d.exercises.map((ex) => (ex.id === updated.id ? updated : ex)) }
          : d
      )
    );
    setEditingExercise(null);
    setEditingDay(null);
  };

  const handleDeleteExercise = (day, exId) => {
    setPlan((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, exercises: d.exercises.filter((ex) => ex.id !== exId) }
          : d
      )
    );
  };

  /* ── Edit-mode callbacks ── */
  const handleReorder = (day, exId, direction) => {
    setPlan((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;
        const exs = [...d.exercises];
        const idx = exs.findIndex((e) => e.id === exId);
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= exs.length) return d;
        [exs[idx], exs[swapIdx]] = [exs[swapIdx], exs[idx]];
        return { ...d, exercises: exs };
      })
    );
  };

  const handleToggleRest = (day) => {
    setPlan((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, isRest: !d.isRest, exercises: d.isRest ? [] : d.exercises }
          : d
      )
    );
  };

  const handleChangeFocus = (day, focus) => {
    setPlan((prev) =>
      prev.map((d) => (d.day === day ? { ...d, focus } : d))
    );
  };

  const handleAddExercise = (day, exercise) => {
    setPlan((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              exercises: [
                ...d.exercises,
                {
                  id: Date.now(),
                  name: exercise.name,
                  sets: 3,
                  reps: 10,
                  duration: 45,
                  muscle: exercise.category,
                  img: exercise.img || "",
                },
              ],
            }
          : d
      )
    );
    setAddExModal(null);
  };

  /* ── Stats ── */
  const totalWorkoutDays = plan.filter((d) => !d.isRest).length;
  const totalExercises   = plan.reduce((acc, d) => acc + d.exercises.length, 0);
  const totalMins        = plan.reduce((acc, d) => acc + d.duration, 0);

  const stats = [
    { label: "Workout Days",    value: totalWorkoutDays, suffix: "/ 7",       icon: CalendarDays },
    { label: "Total Exercises", value: totalExercises,   suffix: "exercises",  icon: Dumbbell     },
    { label: "Total Duration",  value: totalMins,        suffix: "min",        icon: Clock        },
  ];

  return (
    <div ref={containerRef} className="min-h-full bg-surface p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="plan-row flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-foreground">Workout Plan</h1>
            <p className="text-sm text-muted mt-0.5">This Week</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View tabs — hidden in edit mode to keep the UI clean */}
            {!isEditing && (
              <div className="flex gap-5 border-b border-border/10">
                {[{ id: "week", label: "Calendar" }, { id: "list", label: "List" }].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setView(id)}
                    className={`pb-2 text-sm font-semibold transition-all border-b-2 -mb-px ${
                      view === id
                        ? "text-primary border-primary"
                        : "text-muted border-transparent hover:text-foreground/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Edit / Save / Cancel buttons */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 bg-overlay/5 hover:bg-overlay/10 border border-border/10 text-foreground/80 text-sm font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSavePlan}
                  className="flex items-center gap-2 bg-primary hover:bg-primary text-foreground text-sm font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  Save Plan
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnterEdit}
                className="flex items-center gap-2 bg-primary hover:bg-primary text-foreground text-sm font-bold px-4 py-2 rounded-xl transition-colors"
              >
                <Pencil size={14} />
                Edit Plan
              </motion.button>
            )}
          </div>
        </div>

        {/* Edit-mode banner */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-primary"
            >
              <Pencil size={13} />
              Edit mode — changes are saved to this session only
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary stats */}
        <div className="plan-row flex gap-4 overflow-x-auto pb-1">
          {stats.map(({ label, value, suffix, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
              className="bg-overlay/5 border border-border/10 rounded-2xl p-4 flex items-center gap-4 shrink-0 min-w-[180px]"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xl font-black text-foreground">
                  {value}
                  <span className="text-xs font-semibold text-muted ml-1">{suffix}</span>
                </p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Calendar or List view */}
        <AnimatePresence mode="wait">
          {view === "week" && !isEditing ? (
            <motion.div
              key="week"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              <div className="plan-row bg-overlay/5 border border-border/10 rounded-2xl p-4">
                <WeekStrip plan={plan} activeDay={activeDay} onSelect={setActiveDay} />
              </div>

              <AnimatePresence mode="wait">
                {activeDayData && (
                  <DayDetail
                    key={activeDay}
                    dayData={activeDayData}
                    onEditExercise={(ex) => { setEditingExercise(ex); setEditingDay(activeDay); }}
                    onDeleteExercise={(id) => handleDeleteExercise(activeDay, id)}
                    onStartWorkout={() => {}}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="space-y-3"
            >
              {plan.map((d) => (
                <AccordionDay
                  key={d.day}
                  dayData={d}
                  isEditing={isEditing}
                  onEditExercise={(ex) => { setEditingExercise(ex); setEditingDay(d.day); }}
                  onDeleteExercise={handleDeleteExercise}
                  onReorder={handleReorder}
                  onToggleRest={handleToggleRest}
                  onChangeFocus={handleChangeFocus}
                  onOpenAddExercise={(day) => setAddExModal(day)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit exercise modal */}
      <AnimatePresence>
        {editingExercise && (
          <EditExerciseModal
            exercise={editingExercise}
            onSave={handleSaveExercise}
            onClose={() => { setEditingExercise(null); setEditingDay(null); }}
          />
        )}
      </AnimatePresence>

      {/* Add Exercise modal */}
      <AnimatePresence>
        {addExModal && (
          <AddExerciseModal
            targetDay={addExModal}
            onAdd={(ex) => handleAddExercise(addExModal, ex)}
            onClose={() => setAddExModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
