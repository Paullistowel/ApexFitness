import { Pencil, Dumbbell, Flame, Droplets, Target, Trophy, Activity } from "lucide-react";

function SectionCard({ title, children }) {
  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl px-5 overflow-hidden">
      {title && <p className="text-xs font-black text-muted uppercase tracking-widest pt-4 pb-1">{title}</p>}
      <div className="divide-y divide-border/5">{children}</div>
    </div>
  );
}

export default function OverviewTab({ onEdit }) {
  const stats = [
    { label: "Workouts Completed", value: "48",     icon: Dumbbell, color: "text-primary", bg: "bg-primary/15" },
    { label: "Total kcal Burned",  value: "18,240", icon: Flame,    color: "text-red-400",    bg: "bg-red-500/15"    },
    { label: "Avg. Daily Water",   value: "1.9 L",  icon: Droplets, color: "text-blue-400",   bg: "bg-blue-500/15"   },
    { label: "Streak",             value: "7 days", icon: Trophy,   color: "text-yellow-400", bg: "bg-yellow-500/15" },
  ];

  const info = [
    { label: "Age",            value: "23"                 },
    { label: "Gender",         value: "Male"               },
    { label: "Height",         value: "175 cm"             },
    { label: "Weight",         value: "82 kg"              },
    { label: "Activity Level", value: "Moderately Active"  },
    { label: "Diet Preference",value: "Vegan"              },
    { label: "Member Since",   value: "Jan 2026"           },
    { label: "Subscription",   value: "Pro Plan"           },
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
