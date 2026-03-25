import { CheckCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";

function SectionCard({ title, children }) {
  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl px-5 overflow-hidden">
      {title && <p className="text-xs font-black text-muted uppercase tracking-widest pt-4 pb-1">{title}</p>}
      <div className="divide-y divide-border/5">{children}</div>
    </div>
  );
}

export default function GoalsTab() {
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((r) => r.data),
  });

  const { data: historySummary } = useQuery({
    queryKey: ["workout-history-summary"],
    queryFn: () => api.get("/workouts/history/summary").then((r) => r.data),
  });

  const { data: dashSummary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => api.get("/dashboard/summary").then((r) => r.data),
  });

  const profile      = profileData?.profile ?? {};
  const currentWeight = profile.weight_kg    ?? null;
  const goalWeight    = profile.goal_weight_kg ?? null;
  const totalSessions = historySummary?.totalSessions ?? 0;
  const streak        = dashSummary?.streak ?? 0;

  const lostKg = currentWeight && goalWeight ? Math.max(0, currentWeight - goalWeight) : null;
  const pct    = currentWeight && goalWeight && lostKg !== null
    ? Math.min(100, Math.round((lostKg / (currentWeight - goalWeight + lostKg)) * 100 || 0))
    : 0;

  const milestones = [
    { label: "First Workout",  done: totalSessions >= 1  },
    { label: "7-day Streak",   done: streak >= 7          },
    { label: `Lose 5 kg`,      done: lostKg !== null && lostKg >= 5 },
    { label: "10 Sessions",    done: totalSessions >= 10  },
  ];

  return (
    <div className="space-y-4">
      {/* Goal banner */}
      <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-5 text-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        />
        <div className="relative">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Current Goal</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: "Target Weight", value: goalWeight    ? `${goalWeight} kg`    : "Not set" },
              { label: "Current Weight",value: currentWeight ? `${currentWeight} kg` : "Not set" },
              { label: "Primary Goal",  value: profile.primary_goal ?? "Not set"                 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-black leading-tight">{value}</p>
                <p className="text-xs text-primary mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          {currentWeight && goalWeight && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-primary">
                <span>Current: {currentWeight} kg</span>
                <span>Target: {goalWeight} kg</span>
              </div>
              <div className="h-2 bg-primary/40 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[10px] text-primary">
                {Math.max(0, currentWeight - goalWeight).toFixed(1)} kg to go · {pct}% complete
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      <SectionCard title="Milestones">
        {milestones.map(({ label, done }) => (
          <div key={label} className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${done ? "bg-green-500/15" : "bg-overlay/10"}`}>
                <CheckCheck size={14} className={done ? "text-green-400" : "text-muted"} />
              </div>
              <span className={`text-sm font-bold ${done ? "text-foreground" : "text-muted"}`}>{label}</span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${done ? "text-green-400 bg-green-500/15 border border-green-500/30" : "text-muted bg-overlay/5 border border-border/10"}`}>
              {done ? "Done" : "Pending"}
            </span>
          </div>
        ))}
      </SectionCard>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {["Workout Plan", "Diet Plan"].map((label) => (
          <button key={label} className="py-3.5 bg-overlay/5 border border-border/10 rounded-2xl text-sm font-bold text-foreground/80 hover:border-primary/40 hover:text-primary transition-all">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
