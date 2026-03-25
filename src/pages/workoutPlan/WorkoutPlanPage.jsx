import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, Dumbbell, Pencil, X, Search, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import WeekStrip from "../../components/WorkoutPlan/WeekStrip";
import DayDetail from "../../components/WorkoutPlan/DayDetail";
import AccordionDay from "../../components/WorkoutPlan/AccordionDay";
import EditExerciseModal from "../../components/WorkoutPlan/EditExerciseModal";
import api from "../../lib/api";

gsap.registerPlugin(useGSAP);

const DAY_NAMES  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DAY_SHORTS = ["Mon","Tues","Wed","Thurs","Fri","Sat","Sun"];
// getDay() → 0=Sun,1=Mon,...,6=Sat
const JS_DAY_TO_NAME = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const todayDay = JS_DAY_TO_NAME[new Date().getDay()];
const FALLBACK_IMG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&q=80";

function normalizeApiPlan(apiData) {
  if (!apiData?.days) return null;
  return apiData.days.map((day) => ({
    day:       DAY_NAMES[day.day_index]  ?? DAY_NAMES[0],
    short:     DAY_SHORTS[day.day_index] ?? DAY_SHORTS[0],
    isRest:    day.is_rest ?? false,
    category:  day.focus ?? "Strength",
    duration:  day.estimated_duration_mins ?? 0,
    _dayIndex: day.day_index,
    exercises: (day.exercises ?? []).map((ex) => ({
      id:          ex.id,
      _isNew:      false,
      exercise_id: null,
      name:        ex.name,
      sets:        ex.sets ?? 3,
      reps:        ex.reps ?? 10,
      duration:    ex.duration_secs ?? 45,
      muscle:      ex.muscle_group ?? ex.category,
      img:         ex.img_url ? (ex.img_url.startsWith("http") ? ex.img_url : `${import.meta.env.VITE_BACKEND_URL}${ex.img_url}`) : FALLBACK_IMG,
      category:    ex.category,
    })),
  }));
}

const categoryChipColor = {
  Cardio:      "bg-red-500/15 text-red-400 border border-red-500/30",
  Strength:    "bg-primary/15 text-primary border border-primary/30",
  HIIT:        "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Flexibility: "bg-green-500/15 text-green-400 border border-green-500/30",
};

/* ─── AddExerciseModal ──────────────────────────────────────────────── */
function AddExerciseModal({ targetDay, onAdd, onClose }) {
  const [query, setQuery] = useState("");

  const { data: exercises = [] } = useQuery({
    queryKey: ["exercises-search", query],
    queryFn: () =>
      api.get(`/exercises?search=${encodeURIComponent(query)}`).then((r) => r.data),
    staleTime: 30_000,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-elevated border border-border/10 rounded-2xl w-full max-w-md mx-4 flex flex-col max-h-[80vh] overflow-hidden shadow-2xl"
      >
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

        <div className="overflow-y-auto flex-1 divide-y divide-border/5">
          {exercises.length === 0 ? (
            <p className="text-xs text-subtle text-center py-8">No exercises found.</p>
          ) : (
            exercises.map((ex) => (
              <div key={ex.id} className="flex items-center gap-3 px-5 py-3 hover:bg-overlay/5 transition-colors">
                <img
                  src={ex.img_url ? (ex.img_url.startsWith("http") ? ex.img_url : `${import.meta.env.VITE_BACKEND_URL}${ex.img_url}`) : FALLBACK_IMG}
                  alt={ex.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{ex.name}</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${categoryChipColor[ex.category] ?? "bg-overlay/10 text-muted"}`}>
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
  const [plan, setPlan]                       = useState(null);
  const [activeDay, setActiveDay]             = useState(todayDay);
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingDay, setEditingDay]           = useState(null);
  const [view, setView]                       = useState("week");
  const [isEditing, setIsEditing]             = useState(false);
  const [addExModal, setAddExModal]           = useState(null);
  const [isSaving, setIsSaving]               = useState(false);
  const containerRef = useRef(null);
  const savedPlan    = useRef(null);

  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const { data: planData, isLoading } = useQuery({
    queryKey: ["workout-plan"],
    queryFn: () => api.get("/workout-plan/active").then((r) => r.data),
  });

  const createPlanMutation = useMutation({
    mutationFn: () =>
      api.post("/workout-plan/create", { name: "My Workout Plan" }).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workout-plan"] }),
  });

  // Auto-create plan if none exists
  useEffect(() => {
    if (!isLoading && planData === null && !createPlanMutation.isPending) {
      createPlanMutation.mutate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, planData]);

  // Sync plan from API when not in edit mode
  useEffect(() => {
    if (planData?.days && !isEditing) {
      const normalized = normalizeApiPlan(planData);
      if (normalized) setPlan(normalized);
    }
  }, [planData, isEditing]);

  const planId = planData?.plan?.id;

  useGSAP(() => {
    if (!plan) return;
    gsap.fromTo(
      ".plan-row",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef, dependencies: [!!plan] });

  const activeDayData = plan?.find((d) => d.day === activeDay);

  /* ── Edit mode ── */
  const handleEnterEdit = () => {
    savedPlan.current = JSON.parse(JSON.stringify(plan));
    setView("list");
    setIsEditing(true);
  };

  const handleSavePlan = async () => {
    if (!planId || !savedPlan.current) { setIsEditing(false); return; }
    setIsSaving(true);
    try {
      for (const cur of plan) {
        const idx = cur._dayIndex;
        const old = savedPlan.current.find((d) => d._dayIndex === idx);
        if (!old) continue;

        // Update day properties if changed
        if (cur.isRest !== old.isRest || cur.category !== old.category || cur.duration !== old.duration) {
          await api.put(`/workout-plan/${planId}/day/${idx}`, {
            is_rest: cur.isRest,
            focus: cur.category,
            estimated_duration_mins: cur.duration,
          });
        }

        // Remove exercises deleted during edit
        const curApiIds = new Set(cur.exercises.filter((e) => !e._isNew).map((e) => e.id));
        for (const ex of old.exercises) {
          if (!curApiIds.has(ex.id)) {
            await api.delete(`/workout-plan/${planId}/day/${idx}/exercises/${ex.id}`);
          }
        }

        // Add new exercises
        for (const ex of cur.exercises) {
          if (ex._isNew && ex.exercise_id) {
            await api.post(`/workout-plan/${planId}/day/${idx}/exercises`, {
              exercise_id: ex.exercise_id,
              sets: ex.sets,
              reps: ex.reps || null,
              duration_secs: ex.duration,
            });
          }
        }

        // Reorder if order changed (only API exercises)
        const curNonNew = cur.exercises.filter((e) => !e._isNew).map((e) => e.id);
        const oldNonNew = old.exercises.map((e) => e.id);
        if (JSON.stringify(curNonNew) !== JSON.stringify(oldNonNew) && curNonNew.length > 0) {
          await api.put(`/workout-plan/${planId}/day/${idx}/exercises/reorder`, { orderedIds: curNonNew });
        }
      }
      queryClient.invalidateQueries({ queryKey: ["workout-plan"] });
    } catch (err) {
      console.error("Failed to save plan:", err);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
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
        d.day === day ? { ...d, exercises: d.exercises.filter((ex) => ex.id !== exId) } : d
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
        d.day === day ? { ...d, isRest: !d.isRest, exercises: d.isRest ? [] : d.exercises } : d
      )
    );
  };

  const handleChangeFocus = (day, focus) => {
    setPlan((prev) => prev.map((d) => (d.day === day ? { ...d, category: focus } : d)));
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
                  _isNew: true,
                  exercise_id: exercise.id,
                  name: exercise.name,
                  sets: 3,
                  reps: 10,
                  duration: 45,
                  muscle:   exercise.muscle_group ?? exercise.category,
                  duration: exercise.duration_secs ?? 45,
                  img:      exercise.img_url ? (exercise.img_url.startsWith("http") ? exercise.img_url : `${import.meta.env.VITE_BACKEND_URL}${exercise.img_url}`) : FALLBACK_IMG,
                  category: exercise.category,
                },
              ],
            }
          : d
      )
    );
    setAddExModal(null);
  };

  /* ── Stats ── */
  const totalWorkoutDays = plan ? plan.filter((d) => !d.isRest).length : 0;
  const totalExercises   = plan ? plan.reduce((acc, d) => acc + d.exercises.length, 0) : 0;
  const totalMins        = plan ? plan.reduce((acc, d) => acc + (d.duration || 0), 0) : 0;

  const stats = [
    { label: "Workout Days",    value: totalWorkoutDays, suffix: "/ 7",      icon: CalendarDays },
    { label: "Total Exercises", value: totalExercises,   suffix: "exercises", icon: Dumbbell    },
    { label: "Total Duration",  value: totalMins,        suffix: "min",       icon: Clock       },
  ];

  if (isLoading || (planData === null && createPlanMutation.isPending) || !plan) {
    return (
      <div className="min-h-full bg-surface flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-full bg-surface p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="plan-row flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-foreground">Workout Plan</h1>
            <p className="text-sm text-muted mt-0.5">{planData?.plan?.name ?? "This Week"}</p>
          </div>
          <div className="flex items-center gap-2">
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

            {isEditing ? (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-overlay/5 hover:bg-overlay/10 border border-border/10 text-foreground/80 text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  onClick={handleSavePlan}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-primary text-foreground text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSaving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Save Plan
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                onClick={handleEnterEdit}
                className="flex items-center gap-2 bg-primary text-foreground text-sm font-bold px-4 py-2 rounded-xl transition-colors"
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
              Edit mode — click Save Plan to persist changes
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
                    onStartWorkout={() => navigate("/workouts/start", { state: { dayData: activeDayData } })}
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

      <AnimatePresence>
        {editingExercise && (
          <EditExerciseModal
            exercise={editingExercise}
            onSave={handleSaveExercise}
            onClose={() => { setEditingExercise(null); setEditingDay(null); }}
          />
        )}
      </AnimatePresence>

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
