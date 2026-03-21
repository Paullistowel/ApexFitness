import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import {
  Play, BookOpen, CalendarDays, ClipboardList, Droplets,
  Flame, Footprints, Scale, CheckCircle2, MessageSquare,
} from "lucide-react";
import WeightTrendChart  from "../../components/Shared/WeightTrendChart";
import ActivityChart     from "../../components/Shared/ActivityChart";

// ─── Data ─────────────────────────────────────────────────────────────────────
const weight7 = [
  { day: "Mon", weight: 86 }, { day: "Tue", weight: 84 },
  { day: "Wed", weight: 83 }, { day: "Thu", weight: 82.5 },
  { day: "Fri", weight: 83 }, { day: "Sat", weight: 82 },
  { day: "Sun", weight: 81 },
];

const weight30 = [
  { day: "1",  weight: 90   }, { day: "2",  weight: 89.5 }, { day: "3",  weight: 89   },
  { day: "4",  weight: 88.8 }, { day: "5",  weight: 88.5 }, { day: "6",  weight: 88   },
  { day: "7",  weight: 87.5 }, { day: "8",  weight: 87.8 }, { day: "9",  weight: 87.2 },
  { day: "10", weight: 87   }, { day: "11", weight: 86.5 }, { day: "12", weight: 86.2 },
  { day: "13", weight: 86   }, { day: "14", weight: 85.8 }, { day: "15", weight: 85.5 },
  { day: "16", weight: 85.8 }, { day: "17", weight: 85.2 }, { day: "18", weight: 85   },
  { day: "19", weight: 84.5 }, { day: "20", weight: 84.2 }, { day: "21", weight: 84   },
  { day: "22", weight: 83.8 }, { day: "23", weight: 83.5 }, { day: "24", weight: 83.2 },
  { day: "25", weight: 83   }, { day: "26", weight: 82.5 }, { day: "27", weight: 82.2 },
  { day: "28", weight: 82   }, { day: "29", weight: 81.5 }, { day: "30", weight: 81   },
];

const stepsData = [
  { day: "Mon", value: 4500 }, { day: "Tue", value: 2000 },
  { day: "Wed", value: 3200 }, { day: "Thu", value: 3500 },
  { day: "Fri", value: 3800 }, { day: "Sat", value: 2800 },
  { day: "Sun", value: 4800 },
];

const workoutData = [
  { day: "Mon", value: 45 }, { day: "Tue", value: 0  },
  { day: "Wed", value: 30 }, { day: "Thu", value: 60 },
  { day: "Fri", value: 50 }, { day: "Sat", value: 20 },
  { day: "Sun", value: 75 },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const slideIn = (dir = "left") => ({
  hidden:  { opacity: 0, x: dir === "left" ? -40 : 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
});

// ─── Stat Chip ────────────────────────────────────────────────────────────────
function StatChip({ icon: Icon, iconColor, label, value, dot, dotColor }) {
  return (
    <div className="flex items-center gap-2.5 bg-overlay/5 border border-border/10 rounded-xl px-3.5 py-2.5">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={14} className="text-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted leading-none mb-0.5">{label}</p>
        <p className="text-xs font-bold text-foreground leading-none">{value}</p>
      </div>
      <span className={`ml-auto w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
    </div>
  );
}

// ─── Macro Row ────────────────────────────────────────────────────────────────
function MacroRow({ label, current, goal, unit, barColor }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-xs font-semibold text-foreground">
          {current}<span className="text-muted font-normal">/{goal}{unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full bg-overlay/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, to }) {
  const inner = (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-overlay/5 border border-border/10 hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
        <Icon size={15} className="text-primary group-hover:text-foreground transition-colors" />
      </div>
      <span className="text-[10px] font-medium text-muted group-hover:text-foreground text-center leading-tight transition-colors">
        {label}
      </span>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : <button className="w-full">{inner}</button>;
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const [weightRange, setWeightRange] = useState("7 days");
  const [activityTab, setActivityTab] = useState("Steps");

  const weightData        = weightRange === "7 days" ? weight7 : weight30;
  const weightDomain      = weightRange === "7 days" ? [80, 87] : [80, 91];
  const activityData      = activityTab === "Steps" ? stepsData : workoutData;
  const activityFormatter = activityTab === "Steps"
    ? (v) => [v.toLocaleString(), "Steps"]
    : (v) => [`${v} min`, "Workout"];

  const streakDays = [
    { label: "Mon", done: true  },
    { label: "Tue", done: true  },
    { label: "Wed", done: true  },
    { label: "Thu", done: true  },
    { label: "Fri", done: true  },
    { label: "Sat", done: true  },
    { label: "Sun", done: false, today: true },
  ];

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-6xl mx-auto p-5 sm:p-6 space-y-6">

        {/* ── Header ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="space-y-4"
        >
          {/* Greeting row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-foreground">
                Good morning,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">
                  Emmanuel
                </span>
              </h1>
              <p className="text-sm text-muted mt-0.5">Here's your fitness summary for today.</p>
            </div>
            <div className="flex items-center gap-2 bg-overlay/5 border border-border/10 rounded-full px-4 py-2 text-xs text-muted self-start sm:self-auto shrink-0">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Saturday, March 21 2026
            </div>
          </div>

          {/* Today's Goals summary chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatChip
              icon={Flame}
              iconColor="bg-primary"
              label="Calories Burned"
              value="450 / 1,200 kcal"
              dot
              dotColor="bg-primary"
            />
            <StatChip
              icon={Droplets}
              iconColor="bg-sky-500"
              label="Water Intake"
              value="1.8 / 3 L"
              dot
              dotColor="bg-sky-400"
            />
            <StatChip
              icon={Footprints}
              iconColor="bg-violet-500"
              label="Steps Today"
              value="4,800 steps"
              dot
              dotColor="bg-violet-400"
            />
            <StatChip
              icon={Scale}
              iconColor="bg-emerald-600"
              label="Weight"
              value="82 kg"
              dot
              dotColor="bg-emerald-400"
            />
          </div>
        </motion.div>

        {/* ── Two-column main grid ── */}
        <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-5"}`}>

          {/* ── LEFT column (col-span-3) ── */}
          <div className={`space-y-5 ${isMobile ? "" : "col-span-3"}`}>

            {/* Today's Workout banner card */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary/40 to-transparent p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Today's Workout</p>
                    <h3 className="text-lg font-black text-foreground leading-tight">Chest &amp; Triceps</h3>
                    <p className="text-sm text-muted mt-0.5">45 min &nbsp;&middot;&nbsp; 5 exercises</p>

                    {/* Progress bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs text-muted">
                        <span>Progress</span>
                        <span className="text-primary font-semibold">2 / 5 done</span>
                      </div>
                      <div className="h-2 w-full bg-overlay/10 rounded-full overflow-hidden">
                        <div className="h-full w-2/5 bg-gradient-to-r from-primary to-blue-700 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/workouts"
                    className="shrink-0 flex items-center gap-2 bg-primary hover:bg-primary transition-colors text-foreground text-sm font-bold px-4 py-2.5 rounded-xl"
                  >
                    <Play size={14} className="fill-white" />
                    Start
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Weight Trend Chart */}
            <motion.div variants={slideIn("left")} initial="hidden" animate="visible">
              <WeightTrendChart
                data={weightData}
                domain={weightDomain}
                range={weightRange}
                onRangeChange={setWeightRange}
                height={isMobile ? 140 : 160}
                subtitle={weightRange === "30 days" ? "−9 kg over 30 days" : undefined}
              />
            </motion.div>

            {/* Activity Chart */}
            <motion.div variants={slideIn("left")} initial="hidden" animate="visible">
              <ActivityChart
                data={activityData}
                tab={activityTab}
                onTabChange={setActivityTab}
                formatter={activityFormatter}
                height={isMobile ? 140 : 160}
                subtitle={activityTab === "Steps" ? "Daily steps this week" : "Workout minutes this week"}
              />
            </motion.div>
          </div>

          {/* ── RIGHT column (col-span-2) ── */}
          <div className={`space-y-5 ${isMobile ? "" : "col-span-2"}`}>

            {/* Nutrition Today */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="bg-overlay/5 border border-border/10 rounded-2xl p-4 sm:p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Nutrition Today</h3>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
                  1,240 / 2,000 kcal
                </span>
              </div>
              <div className="space-y-3">
                <MacroRow label="Protein"      current={120} goal={150} unit="g"   barColor="bg-primary" />
                <MacroRow label="Carbohydrates" current={180} goal={250} unit="g"  barColor="bg-sky-500"    />
                <MacroRow label="Fat"           current={45}  goal={65}  unit="g"  barColor="bg-violet-500" />
                <MacroRow label="Calories"      current={1240} goal={2000} unit=" kcal" barColor="bg-emerald-500" />
              </div>
            </motion.div>

            {/* Weekly Streak */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="bg-overlay/5 border border-border/10 rounded-2xl p-4 sm:p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Weekly Streak</h3>
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
                  🔥 7 day streak
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {streakDays.map((d) => (
                  <div key={d.label} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                        ${d.today
                          ? "bg-primary text-foreground ring-2 ring-primary/50"
                          : d.done
                          ? "bg-primary/20 text-primary"
                          : "bg-overlay/5 text-subtle"
                        }`}
                    >
                      {d.done
                        ? <CheckCircle2 size={14} className={d.today ? "text-foreground" : "text-primary"} />
                        : <span className="text-[10px]">{d.label[0]}</span>
                      }
                    </div>
                    <span className={`text-[9px] font-medium ${d.today ? "text-primary" : "text-subtle"}`}>
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="bg-overlay/5 border border-border/10 rounded-2xl p-4 sm:p-5 space-y-3"
            >
              <h3 className="text-sm font-bold text-foreground">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-2">
                <QuickAction icon={Play}          label="Start Workout"  to="/workouts"        />
                <QuickAction icon={ClipboardList} label="Log Meal"       to="/nutrition/log-meal" />
                <QuickAction icon={Droplets}      label="Water"          to="/nutrition/water" />
                <QuickAction icon={BookOpen}      label="Diet Plan"      to="/diet"            />
                <QuickAction icon={CalendarDays}  label="Workout Plan"   to="/workouts/plan"   />
                <QuickAction icon={MessageSquare} label="Chat"           to="/trainer"         />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
