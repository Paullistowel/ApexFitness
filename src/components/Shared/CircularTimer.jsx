/**
 * CircularTimer — reusable SVG ring timer
 *
 * Props:
 *   timeLeft   {number}  — seconds remaining
 *   totalTime  {number}  — total seconds for this interval
 *   isRest     {boolean} — switches color + label to "Rest" mode
 */
export default function CircularTimer({ timeLeft, totalTime, isRest }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference * (1 - progress);
  const color = isRest ? "#38bdf8" : "#f97316";

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="relative flex items-center justify-center">
      <svg width="220" height="220" className="-rotate-90">
        {/* Track */}
        <circle
          cx="110" cy="110" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx="110" cy="110" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>

      {/* Centre content */}
      <div className="absolute flex flex-col items-center">
        {isRest ? (
          <>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">
              Rest
            </span>
            <span className="text-5xl font-black text-foreground">
              {mm}:{ss}
            </span>
          </>
        ) : (
          <>
            <span className="text-4xl font-black text-foreground">
              {mm}:{ss}
            </span>
            <span className="text-xs font-semibold text-muted uppercase tracking-widest mt-1">
              Workout Timer
            </span>
          </>
        )}
      </div>
    </div>
  );
}
