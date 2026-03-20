import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Play, Pause, RotateCcw, SkipForward,
  CheckCircle2, ChevronRight, Flame, Clock,
  Dumbbell, Trophy, ChevronLeft, ListChecks,
} from "lucide-react";
import CircularTimer from "../../../components/Shared/CircularTimer";



import img1 from "../../../Assets/download (1).gif";
import img2 from "../../../Assets/How To Do Incline Push-Up Perfectly_ 2026 Video Guide.jpg";
import img3 from "../../../Assets/Lift Manual - Visual Workout Guides.jpg";
import img4 from "../../../Assets/The Complete Guide to Ab Workout at Home.gif";
import img5 from "../../../Assets/Side Plank.jpg";

gsap.registerPlugin(useGSAP);
// ─── Workout Data ─────────────────────────────────────────────────────────────
const workoutExercises = [
  { id: 1, name: "Jumping Jacks",  sets: 2, reps: null, duration: 60, instruction: "Land softly with slightly bent knees. Keep a steady rhythm.",            muscle: "Full Body",     img: img1 },
  { id: 2, name: "Push-Ups",       sets: 3, reps: 12,   duration: 45, instruction: "Keep your body in a straight line from head to heels.",                 muscle: "Chest · Triceps", img: img2 },
  { id: 3, name: "Barbell Squat",  sets: 4, reps: 10,   duration: 50, instruction: "Keep chest up, drive through your heels. Go below parallel.",           muscle: "Quads · Glutes",  img: img3 },
  { id: 4, name: "Burpees",        sets: 2, reps: null, duration: 40, instruction: "Explosive full-body movement. Keep core tight throughout.",              muscle: "Full Body",     img: img4 },
  { id: 5, name: "Plank Hold",     sets: 3, reps: null, duration: 30, instruction: "Engage core and glutes. Don't let hips drop or rise.",                  muscle: "Core",          img: img5 },
];

const REST_DURATION = 15;

// ─── Workout Complete Overlay ─────────────────────────────────────────────────
function WorkoutComplete({ totalTime, onClose }) {
  const mins  = Math.floor(totalTime / 60);
  const stats = [
    { label: "Duration",  value: `${mins} min`,          icon: Clock    },
    { label: "Exercises", value: workoutExercises.length, icon: Dumbbell },
    { label: "Calories",  value: "~320 kcal",             icon: Flame    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-[#1a0f08] z-50 flex flex-col items-center justify-center gap-6 p-8"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center"
        >
          <Trophy size={48} className="text-orange-500" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-center">
          <h1 className="text-3xl font-black text-white">Workout Complete! 🎉</h1>
          <p className="text-gray-400 mt-2">Great job! You crushed today's session.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="grid grid-cols-3 gap-4 w-full">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2">
              <Icon size={20} className="text-orange-500" />
              <span className="text-lg font-black text-white">{value}</span>
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-bold rounded-full transition-all shadow-lg shadow-orange-500/20"
        >
          Back to Dashboard
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Exercise Card (animated on change) ──────────────────────────────────────
function ExerciseCard({ exercise, isRest, currentSet, direction }) {
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
          <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            {exercise.muscle}
          </span>
          {isRest && (
            <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Rest</span>
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white">{exercise.name}</h2>
        <p className="text-sm text-white/60 mt-0.5 line-clamp-1">{exercise.instruction}</p>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StartWorkout() {
  const navigate  = useNavigate();
  const isMobile  = useMediaQuery("(max-width: 768px)");
  const pageRef   = useRef(null);

  const [currentIdx,         setCurrentIdx]         = useState(0);
  const [currentSet,         setCurrentSet]         = useState(1);
  const [isPlaying,          setIsPlaying]          = useState(false);
  const [isRest,             setIsRest]             = useState(false);
  const [timeLeft,           setTimeLeft]           = useState(workoutExercises[0].duration);
  const [totalElapsed,       setTotalElapsed]       = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showComplete,       setShowComplete]       = useState(false);
  const [direction,          setDirection]          = useState(1);
  const intervalRef = useRef(null);

  const current         = workoutExercises[currentIdx];
  const next            = workoutExercises[currentIdx + 1];
  const totalExercises  = workoutExercises.length;
  const overallProgress = Math.round(
    ((completedExercises.length + (currentSet - 1) / current.sets) / totalExercises) * 100
  );

  // GSAP page entrance
  useGSAP(() => {
    gsap.fromTo(
      ".gsap-row",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }
    );
  }, { scope: pageRef });

  // Timer tick
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
  }, [isPlaying, currentIdx, currentSet, isRest]);

  const goNextExercise = () => {
    setDirection(1);
    setCompletedExercises((p) => [...p, current.id]);
    if (currentIdx + 1 >= totalExercises) {
      setShowComplete(true);
    } else {
      const nxt = workoutExercises[currentIdx + 1];
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

  if (showComplete) {
    return (
      <WorkoutComplete
        totalTime={totalElapsed}
        onClose={() => {
          handleReset(); setCurrentIdx(0);
          setCompletedExercises([]); setTotalElapsed(0);
          setShowComplete(false); navigate("/dashboard");
        }}
      />
    );
  }

  // ── Shared sub-sections ──────────────────────────────────────────────────────
  const exerciseCard = (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <ExerciseCard
          key={current.id} exercise={current}
          isRest={isRest} currentSet={currentSet} direction={direction}
        />
      </AnimatePresence>

      {/* Set indicators */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Array.from({ length: current.sets }).map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full transition-colors ${
              i < currentSet - 1 ? "bg-orange-500"
              : i === currentSet - 1 ? isRest ? "bg-sky-400" : "bg-orange-400"
              : "bg-white/10"
            }`} />
          ))}
          <span className="text-xs font-semibold text-gray-400 ml-1">Set {currentSet} of {current.sets}</span>
        </div>
        {current.reps && (
          <span className="text-xs font-bold text-gray-300 bg-white/10 px-3 py-1 rounded-full">
            {current.reps} reps
          </span>
        )}
      </div>

      {/* Timer + controls */}
      <div className="flex flex-col items-center py-6 gap-5">
        <CircularTimer
          timeLeft={timeLeft}
          totalTime={isRest ? REST_DURATION : current.duration}
          isRest={isRest}
        />
        <div className="flex items-center gap-4">
          <button onClick={handleReset} className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors">
            <RotateCcw size={18} className="text-gray-300" />
          </button>
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 flex items-center justify-center transition-all shadow-lg shadow-orange-500/30"
          >
            {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
          </button>
          <button onClick={handleSkip} className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors">
            <SkipForward size={18} className="text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );

  const upNext = next && (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="relative h-36">
        <img src={next.img} alt={next.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase backdrop-blur-sm">Up Next</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white font-black text-base">{next.name}</p>
            <p className="text-white/60 text-xs">{next.sets} sets · {next.duration}s</p>
          </div>
          <button onClick={handleSkip} className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  const exerciseList = (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-orange-500" />
          <span className="text-sm font-bold text-white">Exercise List</span>
        </div>
        <span className="text-xs text-gray-500">{totalExercises} exercises</span>
      </div>
      <div className="divide-y divide-white/5">
        {workoutExercises.map((ex, idx) => {
          const isDone    = completedExercises.includes(ex.id);
          const isCurrent = idx === currentIdx;
          return (
            <div key={ex.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${isCurrent ? "bg-orange-500/10" : ""}`}>
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                )}
              </div>
              <img src={ex.img} alt={ex.name} className="w-9 h-9 rounded-lg object-cover shrink-0 opacity-80" />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${isCurrent ? "text-orange-400" : isDone ? "text-gray-600 line-through" : "text-gray-300"}`}>
                  {ex.name}
                </p>
                <p className="text-[11px] text-gray-600">
                  {ex.sets} sets · {ex.reps ? `${ex.reps} reps` : `${ex.duration}s`}
                </p>
              </div>
              {isCurrent && (
                <span className="shrink-0 text-[10px] font-bold text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-full">Now</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const finishBtn = (
    <button
      onClick={() => setShowComplete(true)}
      className="w-full py-4 bg-white/5 border border-orange-500/30 hover:bg-orange-500/10 text-orange-400 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
    >
      <CheckCircle2 size={18} />
      Finish Workout
    </button>
  );

  return (
    <div ref={pageRef} className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-5">

      {/* Header */}
      <div className="gsap-row flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
          <h1 className="text-lg sm:text-xl font-black text-white">Start Workout</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-2">
            <Flame size={14} className="text-orange-500" />
            <span className="text-xs sm:text-sm font-bold text-gray-300">~{Math.round(totalElapsed / 10)} kcal</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-2">
            <Clock size={14} className="text-gray-400" />
            <span className="text-xs sm:text-sm font-bold text-gray-300">
              {String(Math.floor(totalElapsed / 60)).padStart(2, "0")}:{String(totalElapsed % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="gsap-row space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{completedExercises.length} of {totalExercises} exercises done</span>
          <span>{overallProgress}% complete</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* ── Mobile layout (stacked) ── */}
      {isMobile ? (
        <div className="space-y-4">
          <div className="gsap-row">{exerciseCard}</div>
          <div className="gsap-row">{finishBtn}</div>
          {next && <div className="gsap-row">{upNext}</div>}
          <div className="gsap-row">{exerciseList}</div>
        </div>
      ) : (
        /* ── Desktop layout (2-col grid) ── */
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-3 space-y-4 gsap-row">
            {exerciseCard}
            {finishBtn}
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
