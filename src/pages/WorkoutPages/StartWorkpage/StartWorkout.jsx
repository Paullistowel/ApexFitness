import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Play, Pause, RotateCcw, SkipForward,
  CheckCircle2, ChevronRight, Flame, Clock,
  Dumbbell, Trophy, ListChecks, CalendarDays,
} from "lucide-react";
import CircularTimer from "../../../components/Shared/CircularTimer";
import api from "../../../lib/api";

gsap.registerPlugin(useGSAP);

const FALLBACK_IMG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80";
const REST_DURATION = 15;

// ─── Normalizers ──────────────────────────────────────────────────────────────
function normalizeExercise(ex, idx) {
  return {
    id:          ex.id ?? idx,
    name:        ex.name,
    sets:        ex.sets  ?? 3,
    reps:        ex.reps  || null,
    duration:    ex.duration ?? 45,
    instruction: ex.instruction ?? "Perform with controlled form and full range of motion.",
    muscle:      ex.muscle ?? ex.muscle_group ?? ex.category ?? "Full Body",
    img:         (() => { const u = ex.img || ex.img_url; return u ? (u.startsWith("http") ? u : `${import.meta.env.VITE_BACKEND_URL}${u}`) : FALLBACK_IMG; })(),
  };
}

function parseRepsDisplay(str) {
  if (!str) return { reps: null, duration: 45 };
  if (str.endsWith(" reps")) return { reps: parseInt(str), duration: 45 };
  if (str.endsWith("s"))     return { reps: null, duration: parseInt(str) || 45 };
  return { reps: null, duration: 45 };
}

function normalizeHistoryExercise(ex, idx) {
  const { reps, duration } = parseRepsDisplay(ex.reps_display);
  return {
    id:          ex.id ?? idx,
    name:        ex.exercise_name,
    sets:        ex.sets ?? 3,
    reps,
    duration,
    instruction: "Perform with controlled form and full range of motion.",
    muscle:      "—",
    img:         FALLBACK_IMG,
  };
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
        <div className="relative w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Dumbbell size={40} className="text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-foreground">No Workout History Yet</h2>
        <p className="text-sm text-muted max-w-xs leading-relaxed">
          You haven't completed any sessions yet. Head to your workout plan to kick off your first one.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => navigate("/workouts/plan")}
          className="flex items-center gap-2 bg-primary text-foreground font-bold px-6 py-3 rounded-xl transition-all hover:opacity-90 shadow-lg shadow-primary/20"
        >
          <CalendarDays size={16} />
          Go to Workout Plan
        </button>
        <button
          onClick={() => navigate("/workouts")}
          className="flex items-center gap-2 bg-overlay/5 border border-border/10 text-foreground/80 font-bold px-6 py-3 rounded-xl hover:bg-overlay/10 transition-all"
        >
          Browse Library
        </button>
      </div>
    </div>
  );
}

// ─── Workout Complete Overlay ─────────────────────────────────────────────────
function WorkoutComplete({ totalTime, exerciseCount, isLogging, onClose }) {
  const mins = Math.floor(totalTime / 60) || 1;
  const kcal = Math.round(totalTime / 10);
  const stats = [
    { label: "Duration",  value: `${mins} min`,  icon: Clock    },
    { label: "Exercises", value: exerciseCount,   icon: Dumbbell },
    { label: "Calories",  value: `~${kcal} kcal`, icon: Flame   },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-surface z-50 flex flex-col items-center justify-center gap-6 p-8"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
        >
          <Trophy size={48} className="text-primary" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-center">
          <h1 className="text-3xl font-black text-foreground">Workout Complete! 🎉</h1>
          <p className="text-muted mt-2">Great job! You crushed today's session.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="grid grid-cols-3 gap-4 w-full">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-overlay/5 border border-border/10 rounded-2xl p-4 flex flex-col items-center gap-2">
              <Icon size={20} className="text-primary" />
              <span className="text-lg font-black text-foreground">{value}</span>
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          onClick={onClose}
          disabled={isLogging}
          className="w-full py-3 bg-gradient-to-r from-primary to-blue-700 text-foreground font-bold rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLogging && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isLogging ? "Saving…" : "Done"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Exercise Card ────────────────────────────────────────────────────────────
function ExerciseCard({ exercise, isRest, direction }) {
  return (
    <motion.div
      key={exercise.id}
      initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="relative h-44 sm:h-52"
    >
      <img src={exercise.img} alt={exercise.name} className="w-full h-full object-cover rounded-t-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-2xl" />
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-primary text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            {exercise.muscle}
          </span>
          {isRest && (
            <span className="bg-sky-500 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Rest</span>
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-black text-foreground">{exercise.name}</h2>
        <p className="text-sm text-foreground/60 mt-0.5 line-clamp-1">{exercise.instruction}</p>
      </div>
    </motion.div>
  );
}

// ─── Workout Session ──────────────────────────────────────────────────────────
function WorkoutSession({ exercises, dayData, fromPlan, sessionLabel, onDone }) {
  const navigate    = useNavigate();
  const isMobile    = useMediaQuery("(max-width: 768px)");
  const pageRef     = useRef(null);
  const queryClient = useQueryClient();

  const [currentIdx,         setCurrentIdx]         = useState(0);
  const [currentSet,         setCurrentSet]         = useState(1);
  const [isPlaying,          setIsPlaying]          = useState(false);
  const [isRest,             setIsRest]             = useState(false);
  const [timeLeft,           setTimeLeft]           = useState(exercises[0]?.duration ?? 45);
  const [totalElapsed,       setTotalElapsed]       = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showComplete,       setShowComplete]       = useState(false);
  const [direction,          setDirection]          = useState(1);
  const intervalRef = useRef(null);

  const logSessionMutation = useMutation({
    mutationFn: (payload) => api.post("/workouts/sessions", payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-history"] });
      queryClient.invalidateQueries({ queryKey: ["workout-history-summary"] });
      queryClient.invalidateQueries({ queryKey: ["workout-history-last"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  const current        = exercises[currentIdx];
  const next           = exercises[currentIdx + 1];
  const totalExercises = exercises.length;
  const overallProgress = Math.round(
    ((completedExercises.length + (currentSet - 1) / (current?.sets || 1)) / totalExercises) * 100
  );

  useGSAP(() => {
    gsap.fromTo(
      ".gsap-row",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }
    );
  }, { scope: pageRef });

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(intervalRef.current); handleTimerEnd(); return 0; }
          return t - 1;
        });
        setTotalElapsed((e) => e + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentIdx, currentSet, isRest]);

  const goNextExercise = () => {
    setDirection(1);
    setCompletedExercises((p) => [...p, current.id]);
    if (currentIdx + 1 >= totalExercises) {
      setShowComplete(true);
    } else {
      const nxt = exercises[currentIdx + 1];
      setCurrentIdx((i) => i + 1);
      setCurrentSet(1);
      setIsRest(false);
      setTimeLeft(nxt.duration);
    }
  };

  const handleTimerEnd = () => {
    setIsPlaying(false);
    if (isRest) {
      setIsRest(false);
      if (currentSet < current.sets) { setCurrentSet((s) => s + 1); setTimeLeft(current.duration); }
      else goNextExercise();
    } else {
      if (currentSet < current.sets) { setIsRest(true); setTimeLeft(REST_DURATION); setIsPlaying(true); }
      else goNextExercise();
    }
  };

  const handleSkip  = () => { clearInterval(intervalRef.current); setIsPlaying(false); goNextExercise(); };
  const handleReset = () => { clearInterval(intervalRef.current); setIsPlaying(false); setIsRest(false); setTimeLeft(current.duration); };
  const handleFinish = () => { clearInterval(intervalRef.current); setIsPlaying(false); setShowComplete(true); };

  const handleDone = async () => {
    const mins = Math.floor(totalElapsed / 60) || 1;
    const kcal = Math.round(totalElapsed / 10);
    await logSessionMutation.mutateAsync({
      name:            dayData ? `${dayData.day} Workout` : sessionLabel ?? "Quick Workout",
      type:            dayData?.category ?? "Strength",
      duration_mins:   mins,
      calories_burned: kcal,
      exercises:       exercises.map((ex) => ({
        exercise_name: ex.name,
        sets:          ex.sets,
        reps_display:  ex.reps ? `${ex.reps} reps` : `${ex.duration}s`,
      })),
    }).catch(() => {});
    if (onDone) { onDone(); } else { navigate("/workouts"); }
  };

  if (showComplete) {
    return (
      <WorkoutComplete
        totalTime={totalElapsed}
        exerciseCount={totalExercises}
        isLogging={logSessionMutation.isPending}
        onClose={handleDone}
      />
    );
  }

  const exerciseCard = (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <ExerciseCard key={current.id} exercise={current} isRest={isRest} direction={direction} />
      </AnimatePresence>

      <div className="px-5 py-3 border-b border-border/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Array.from({ length: current.sets }).map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full transition-colors ${
              i < currentSet - 1     ? "bg-primary"
              : i === currentSet - 1 ? (isRest ? "bg-sky-400" : "bg-primary")
              : "bg-overlay/10"
            }`} />
          ))}
          <span className="text-xs font-semibold text-muted ml-1">Set {currentSet} of {current.sets}</span>
        </div>
        {current.reps && (
          <span className="text-xs font-bold text-foreground/80 bg-overlay/10 px-3 py-1 rounded-full">
            {current.reps} reps
          </span>
        )}
      </div>

      <div className="flex flex-col items-center py-6 gap-5">
        <CircularTimer timeLeft={timeLeft} totalTime={isRest ? REST_DURATION : current.duration} isRest={isRest} />
        <div className="flex items-center gap-4">
          <button onClick={handleReset} className="w-11 h-11 rounded-full bg-overlay/10 hover:bg-overlay/15 flex items-center justify-center transition-colors">
            <RotateCcw size={18} className="text-foreground/80" />
          </button>
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center transition-all shadow-lg shadow-primary/30"
          >
            {isPlaying ? <Pause size={24} className="text-foreground" /> : <Play size={24} className="text-foreground ml-1" />}
          </button>
          <button onClick={handleSkip} className="w-11 h-11 rounded-full bg-overlay/10 hover:bg-overlay/15 flex items-center justify-center transition-colors">
            <SkipForward size={18} className="text-foreground/80" />
          </button>
        </div>
      </div>
    </div>
  );

  const upNext = next && (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden">
      <div className="relative h-36">
        <img src={next.img} alt={next.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-black/50 text-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase backdrop-blur-sm">Up Next</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-foreground font-black text-base">{next.name}</p>
            <p className="text-foreground/60 text-xs">{next.sets} sets · {next.duration}s</p>
          </div>
          <button onClick={handleSkip} className="w-8 h-8 rounded-full bg-overlay/15 backdrop-blur-sm flex items-center justify-center hover:bg-overlay/30 transition-colors">
            <ChevronRight size={16} className="text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );

  const exerciseList = (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/10">
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-primary" />
          <span className="text-sm font-bold text-foreground">Exercise List</span>
        </div>
        <span className="text-xs text-muted">{totalExercises} exercises</span>
      </div>
      <div className="divide-y divide-border/5">
        {exercises.map((ex, idx) => {
          const isDone    = completedExercises.includes(ex.id);
          const isCurrent = idx === currentIdx;
          return (
            <div key={ex.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${isCurrent ? "bg-primary/10" : ""}`}>
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border/20" />
                )}
              </div>
              <img src={ex.img} alt={ex.name} className="w-9 h-9 rounded-lg object-cover shrink-0 opacity-80" />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${isCurrent ? "text-primary" : isDone ? "text-subtle line-through" : "text-foreground/80"}`}>
                  {ex.name}
                </p>
                <p className="text-[11px] text-subtle">
                  {ex.sets} sets · {ex.reps ? `${ex.reps} reps` : `${ex.duration}s`}
                </p>
              </div>
              {isCurrent && (
                <span className="shrink-0 text-[10px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-full">Now</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div ref={pageRef} className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-5">

      {/* Header */}
      <div className="gsap-row flex items-center justify-between">
        <p className="text-base font-black text-foreground">
          {dayData ? `${dayData.day} · ${dayData.category}` : sessionLabel ?? "Quick Workout"}
        </p>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-overlay/5 border border-border/10 rounded-full px-3 sm:px-4 py-2">
            <Flame size={14} className="text-primary" />
            <span className="text-xs sm:text-sm font-bold text-foreground/80">~{Math.round(totalElapsed / 10)} kcal</span>
          </div>
          <div className="flex items-center gap-1.5 bg-overlay/5 border border-border/10 rounded-full px-3 sm:px-4 py-2">
            <Clock size={14} className="text-muted" />
            <span className="text-xs sm:text-sm font-bold text-foreground/80">
              {String(Math.floor(totalElapsed / 60)).padStart(2, "0")}:{String(totalElapsed % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="gsap-row space-y-1">
        <div className="flex justify-between text-xs text-muted">
          <span>{completedExercises.length} of {totalExercises} exercises done</span>
          <span>{overallProgress}% complete</span>
        </div>
        <div className="h-2 bg-overlay/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-700 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Layout */}
      {isMobile ? (
        <div className="space-y-4">
          <div className="gsap-row">{exerciseCard}</div>
          <div className="gsap-row">
            <button onClick={handleFinish} className="w-full py-4 bg-overlay/5 border border-primary/30 hover:bg-primary/10 text-primary font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Finish Workout
            </button>
          </div>
          {next && <div className="gsap-row">{upNext}</div>}
          <div className="gsap-row">{exerciseList}</div>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-3 space-y-4 gsap-row">
            {exerciseCard}
            <button onClick={handleFinish} className="w-full py-4 bg-overlay/5 border border-primary/30 hover:bg-primary/10 text-primary font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Finish Workout
            </button>
          </div>
          <div className="col-span-2 space-y-4 gsap-row">
            {upNext}
            {exerciseList}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Entry point ──────────────────────────────────────────────────────────────
export default function StartWorkout({ onDone }) {
  const location = useLocation();
  const dayData  = location.state?.dayData ?? null;
  const fromPlan = !!dayData;

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["workout-history-last"],
    queryFn: () => api.get("/workouts/history?limit=1").then((r) => r.data),
    enabled: !fromPlan,
  });

  // Loading state (only when fetching history)
  if (!fromPlan && isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine exercises
  let exercises;
  let sessionLabel;
  if (fromPlan) {
    exercises    = (dayData.exercises ?? []).map(normalizeExercise);
    sessionLabel = null;
  } else {
    const lastSession = historyData?.sessions?.[0];
    exercises    = (lastSession?.exercises ?? []).map(normalizeHistoryExercise);
    sessionLabel = lastSession?.name ?? null;
  }

  // No history — show empty state
  if (!fromPlan && exercises.length === 0) {
    return <EmptyState />;
  }

  return (
    <WorkoutSession
      exercises={exercises}
      dayData={dayData}
      fromPlan={fromPlan}
      sessionLabel={sessionLabel}
      onDone={onDone}
    />
  );
}
