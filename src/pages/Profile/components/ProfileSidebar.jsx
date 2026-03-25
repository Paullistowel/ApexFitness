import { Camera, Pencil, Flame, Activity, Droplets, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../../store/authStore";
import api from "../../../lib/api";

export default function ProfileSidebar({ onEdit }) {
  const user = useAuthStore((s) => s.user);

  const { data: summary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => api.get("/dashboard/summary").then((r) => r.data),
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((r) => r.data),
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const profile  = profileData?.profile;
  const waterMl  = summary?.water_ml ?? 0;
  const calsBurned = summary?.calories_burned ?? 0;

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  return (
    <div className="w-72 shrink-0 space-y-4 sticky top-6">

      {/* Avatar card */}
      <div className="bg-overlay/5 border border-border/10 rounded-3xl overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-primary to-blue-700 relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          />
        </div>

        <div className="px-5 pb-5 relative">
          <div className="flex items-end justify-between -mt-8 mb-3">
            <div className="relative">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border-4 border-[#1d1a17] shadow-lg" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-foreground text-xl font-black border-4 border-[#1d1a17] shadow-lg">
                  {initials}
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-elevated border border-border/20 flex items-center justify-center shadow hover:bg-overlay/10 transition-colors">
                <Camera size={11} className="text-muted" />
              </button>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/15 px-2.5 py-1 rounded-full border border-primary/30 capitalize">
              ⭐ {user?.plan ?? "free"}
            </span>
          </div>

          <h2 className="text-base font-black text-foreground">{user?.name ?? "—"}</h2>
          <p className="text-xs text-muted mt-0.5">{user?.email ?? "—"}</p>

          {(profile?.primary_goal || profile?.fitness_level) && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {profile.primary_goal && (
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/30">
                  {profile.primary_goal}
                </span>
              )}
              {profile.fitness_level && (
                <span className="text-[10px] font-bold text-green-400 bg-green-500/15 px-2 py-0.5 rounded-full border border-green-500/30 capitalize">
                  {profile.fitness_level}
                </span>
              )}
            </div>
          )}

          <button
            onClick={onEdit}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-foreground text-sm font-bold py-2.5 rounded-xl transition-colors hover:opacity-90"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Today's quick stats */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-black text-muted uppercase tracking-widest">Today</p>
        {[
          { label: "kcal burned", value: `${calsBurned} kcal`,                          icon: Flame,    color: "#f97316" },
          { label: "Active min",  value: summary?.active_mins ? `${summary.active_mins} min` : "—", icon: Activity, color: "#a855f7" },
          { label: "Water",       value: `${(waterMl / 1000).toFixed(1)} L`,             icon: Droplets, color: "#38bdf8" },
          { label: "Weight",      value: profile?.weight_kg ? `${profile.weight_kg} kg` : "—", icon: Target, color: "#22c55e" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon size={14} style={{ color }} />
              <span className="text-xs text-muted">{label}</span>
            </div>
            <span className="text-xs font-bold text-foreground">{value}</span>
          </div>
        ))}
      </div>

      {/* Membership */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-black text-muted uppercase tracking-widest mb-2">Membership</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Plan</span>
          <span className="text-xs font-bold text-primary capitalize">{user?.plan ?? "free"} Member</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Member since</span>
          <span className="text-xs font-bold text-foreground">{memberSince}</span>
        </div>
      </div>
    </div>
  );
}
