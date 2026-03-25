import { Pencil, Dumbbell, Flame, Droplets, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../../store/authStore";
import api from "../../../lib/api";

function SectionCard({ title, children }) {
  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl px-5 overflow-hidden">
      {title && <p className="text-xs font-black text-muted uppercase tracking-widest pt-4 pb-1">{title}</p>}
      <div className="divide-y divide-border/5">{children}</div>
    </div>
  );
}

export default function OverviewTab({ onEdit }) {
  const user = useAuthStore((s) => s.user);

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((r) => r.data),
  });

  const { data: summary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => api.get("/dashboard/summary").then((r) => r.data),
  });

  const { data: historySummary } = useQuery({
    queryKey: ["workout-history-summary"],
    queryFn: () => api.get("/workouts/history/summary").then((r) => r.data),
  });

  const profile = profileData?.profile ?? {};

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  const stats = [
    { label: "Workouts Completed", value: historySummary?.totalSessions ?? "—", icon: Dumbbell, color: "text-primary",    bg: "bg-primary/15"    },
    { label: "Total kcal Burned",  value: historySummary?.totalCalories ? historySummary.totalCalories.toLocaleString() : "—", icon: Flame, color: "text-red-400", bg: "bg-red-500/15" },
    { label: "Avg. Daily Water",   value: summary?.water_ml ? `${(summary.water_ml / 1000).toFixed(1)} L` : "—", icon: Droplets, color: "text-blue-400", bg: "bg-blue-500/15" },
    { label: "Streak",             value: summary?.streak ? `${summary.streak} days` : "—", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/15" },
  ];

  const info = [
    { label: "Age",            value: profile.age         ? `${profile.age} yrs`  : "—" },
    { label: "Gender",         value: profile.gender                               ?? "—" },
    { label: "Height",         value: profile.height_cm   ? `${profile.height_cm} cm` : "—" },
    { label: "Weight",         value: profile.weight_kg   ? `${profile.weight_kg} kg` : "—" },
    { label: "Fitness Level",  value: profile.fitness_level ? profile.fitness_level.charAt(0).toUpperCase() + profile.fitness_level.slice(1) : "—" },
    { label: "Primary Goal",   value: profile.primary_goal                         ?? "—" },
    { label: "Member Since",   value: memberSince },
    { label: "Subscription",   value: user?.plan ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan` : "—" },
  ];

  return (
    <div className="space-y-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-overlay/5 border border-border/10 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-base font-black text-foreground">{value}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Personal details */}
      <SectionCard title="Personal Details">
        <div className="grid grid-cols-2 py-2">
          {info.map(({ label, value }) => (
            <div key={label} className="py-2.5">
              <p className="text-xs text-muted">{label}</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
            </div>
          ))}
        </div>
        <div className="py-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary transition-colors"
          >
            <Pencil size={14} />
            Edit personal details
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
