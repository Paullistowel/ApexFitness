import { Camera, Pencil, Flame, Activity, Droplets, Target } from "lucide-react";

export default function ProfileSidebar({ onEdit }) {
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
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-foreground text-xl font-black border-4 border-[#1d1a17] shadow-lg">
                EA
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-elevated border border-border/20 flex items-center justify-center shadow hover:bg-overlay/10 transition-colors">
                <Camera size={11} className="text-muted" />
              </button>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/15 px-2.5 py-1 rounded-full border border-primary/30">
              ⭐ Pro
            </span>
          </div>

          <h2 className="text-base font-black text-foreground">Emmanuel Acquah</h2>
          <p className="text-xs text-muted mt-0.5">emma@gmail.com</p>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/30">
              Weight Loss
            </span>
            <span className="text-[10px] font-bold text-green-400 bg-green-500/15 px-2 py-0.5 rounded-full border border-green-500/30">
              Vegan
            </span>
          </div>

          <button
            onClick={onEdit}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-primary hover:text-primary   text-sm font-bold py-2.5 rounded-xl transition-colors"
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
          { label: "kcal burned", value: "450",  icon: Flame,    color: "#f97316" },
          { label: "Active min",  value: "30",   icon: Activity, color: "#a855f7" },
          { label: "Water",       value: "1.8 L", icon: Droplets, color: "#38bdf8" },
          { label: "Weight",      value: "82 kg", icon: Target,  color: "#22c55e" },
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
          <span className="text-xs font-bold text-primary">Pro Member</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Renews</span>
          <span className="text-xs font-bold text-foreground">Apr 1, 2026</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Member since</span>
          <span className="text-xs font-bold text-foreground">Jan 2026</span>
        </div>
      </div>
    </div>
  );
}
