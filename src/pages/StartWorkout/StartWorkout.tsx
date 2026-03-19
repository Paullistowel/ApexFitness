import { useState, useEffect, useRef } from "react";
import { MOCK_EXERCISES } from "../../data/mockData";
import "./StartWorkout.css";

/**
 * StartWorkout page
 * Props:
 *   navigate      – fn(screenId)
 *   timerMinutes  – number: initial minutes (set from WorkoutPlan "Start" button, default 20)
 */
interface StartWorkoutProps {
  navigate: (path: string) => void;
  timerMinutes?: number;
}
export default function StartWorkout({ navigate, timerMinutes = 20 }: StartWorkoutProps) {
  const TOTAL_SECONDS = timerMinutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isRunning,   setIsRunning]   = useState(false);
  const [isDone,      setIsDone]      = useState(false);
  const intervalRef = useRef<number | ReturnType<typeof setInterval> | undefined>(undefined);

  /* Re-initialise when timerMinutes changes (e.g. coming from WorkoutPlan) */
  useEffect(() => {
    setSecondsLeft(timerMinutes * 60);
    setIsRunning(false);
    setIsDone(false);
  }, [timerMinutes]);

  /* Countdown tick */
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      if (secondsLeft === 0 && isRunning) {
        setIsRunning(false);
        setIsDone(true);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, secondsLeft]);

  /* Helpers */
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleReset = () => {
    setSecondsLeft(TOTAL_SECONDS);
    setIsRunning(false);
    setIsDone(false);
  };

  const handleFinish = () => {
    handleReset();
    navigate("dashboard");
  };

  /* Ring progress */
  const circumference = 2 * Math.PI * 85;
  const strokeOffset  = circumference * (1 - secondsLeft / TOTAL_SECONDS);

  /* Current & next exercises (replace with dynamic data when backend is ready) */
  const currentExercise = MOCK_EXERCISES[5]; // Jumping Jacks
  const nextExercise    = MOCK_EXERCISES[6]; // Push-Ups

  return (
    <div className="sw-page screen-enter">
      <h1 className="page-title">Start Workout</h1>

      {/* ── Timer ── */}
      <div className="timer-wrapper">
        <div className="timer-ring-container">
          <svg className="timer-svg" viewBox="0 0 200 200">
            <circle className="ring-track"   cx="100" cy="100" r="85" />
            <circle className="ring-progress" cx="100" cy="100" r="85"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset} />
          </svg>

          <div className="timer-inner">
            <div className="timer-digits" style={{ color: isDone ? "var(--green)" : "var(--text)" }}>
              {isDone ? "Done!" : formatTime(secondsLeft)}
            </div>
            <div className="timer-label">Workout Timer</div>
          </div>

          {/* Subtle play hint when paused */}
          {!isRunning && !isDone && (
            <div className="timer-play-hint" onClick={() => setIsRunning(true)} title="Start">▶</div>
          )}
        </div>

        {/* Controls */}
        <div className="timer-controls">
          <button className="ctrl-btn" onClick={handleReset} title="Reset">↺</button>
          <button
            className="ctrl-btn ctrl-primary"
            onClick={() => { if (!isDone) setIsRunning(r => !r); }}
          >
            {isDone ? "✓" : isRunning ? "⏸" : "▶"}
          </button>
          <button
            className="ctrl-btn"
            style={{ opacity: 0.45 }}
            onClick={() => { setSecondsLeft(0); setIsRunning(false); setIsDone(true); }}
            title="Skip"
          >⏭</button>
        </div>
      </div>

      {/* ── Exercise cards ── */}
      <div className="exercise-row">
        {/* Current exercise */}
        <div className="sw-exercise-card">
          <div className="exercise-img-wrap">
            <img
              src={currentExercise.image}
              alt={currentExercise.name}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div className="exercise-body">
            <h3 className="exercise-name">{currentExercise.name}</h3>
            <p  className="exercise-desc">{currentExercise.description}</p>
            <span className="badge badge-orange">Set 1 of 2</span>
          </div>
        </div>

        {/* Next exercise */}
        <div className="sw-exercise-card">
          <div className="exercise-img-wrap">
            <img
              src={nextExercise.image}
              alt={nextExercise.name}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div className="exercise-body">
            <h3 className="exercise-name">{nextExercise.name}</h3>
            <div className="exercise-up-next">
              <span className="up-next-label">UP NEXT</span>
              <button className="btn-icon">→</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Finish bar ── */}
      <div className="finish-bar">
        <button className="btn btn-primary finish-btn" onClick={handleFinish}>
          ✓ &nbsp; Finish Workout
        </button>
      </div>
    </div>
  );
}
