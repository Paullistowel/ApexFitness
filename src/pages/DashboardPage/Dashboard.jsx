import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import {
  Play, BookOpen, CalendarDays, ClipboardList, Droplets,
  Flame, Footprints, Scale, CheckCircle2, MessageSquare,
} from "lucide-react";
import WeightTrendChart  from "../../components/Shared/WeightTrendChart";
import ActivityChart     from "../../components/Shared/ActivityChart";
import useAuthStore from "../../store/authStore";
import api from "../../lib/api";

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
  const user = useAuthStore((s) => s.user);

  const [weightRange, setWeightRange] = useState("7 days");
  const [activityTab, setActivityTab] = useState("Steps");

  // ── Live API data ──
  const { data: summary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => api.get("/dashboard/summary").then((r) => r.data),
  });

  const { data: weightHistory } = useQuery({
    queryKey: ["weight-history", weightRange],
    queryFn: () => api.get(`/user/weight-history?range=${weightRange === "7 days" ? "7d" : "30d"}`).then((r) => r.data),
  });

  const { data: activityHistory } = useQuery({
    queryKey: ["activity", activityTab],
    queryFn: () => api.get(`/user/activity?type=${activityTab === "Steps" ? "steps" : "workout"}&range=7d`).then((r) => r.data),
  });

  const { data: planData } = useQuery({
    queryKey: ["workout-plan"],
    queryFn: () => api.get("/workout-plan/active").then((r) => r.data),
  });

  // Today's day: 0=Mon … 6=Sun
  const todayDayIdx = (new Date().getDay() + 6) % 7;
  const DAY_NAMES_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const todayPlanDay = planData?.days?.find((d) => d.day_index === todayDayIdx) ?? null;

  // ── Derived values (fall back to 0 while loading) ──
  const macros       = summary?.macros    ?? { protein_g: 0, carbs_g: 0, fat_g: 0, calories_consumed: 0, goal_calories: 2000 };
  const waterMl      = summary?.water_ml  ?? 0;
  const waterGoal    = summary?.water_goal_ml ?? 3000;
  const calsBurned   = summary?.calories_burned ?? 0;
  const streak       = summary?.streak    ?? 0;

  const weightData   = weightHistory?.length ? weightHistory : [];
  const weightVals   = weightData.map((d) => d.weight_kg ?? d.weight);
  const weightMin    = weightVals.length ? Math.floor(Math.min(...weightVals)) - 2 : 75;
  const weightMax    = weightVals.length ? Math.ceil(Math.max(...weightVals))  + 2 : 95;
  const weightDomain = [weightMin, weightMax];

  const activityData = activityHistory?.length ? activityHistory.map((d) => ({ day: d.day, value: Number(d.value) })) : [];

  const activityFormatter = activityTab === "Steps"
    ? (v) => [v.toLocaleString(), "Steps"]
    : (v) => [`${v} min`, "Workout"];

  // Build streak row for the week (Mon–Sun)
  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIdx   = (new Date().getDay() + 6) % 7; // 0=Mon
  const streakDays = DAY_LABELS.map((label, i) => ({
    label,
    done:  i < todayIdx && i < streak,
    today: i === todayIdx,
  }));

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

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
                {greeting},{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">
                  {user?.name?.split(" ")[0] ?? "there"}
                </span>
              </h1>
              <p className="text-sm text-muted mt-0.5">Here's your fitness summary for today.</p>
            </div>
            <div className="flex items-center gap-2 bg-overlay/5 border border-border/10 rounded-full px-4 py-2 text-xs text-muted self-start sm:self-auto shrink-0">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {dateLabel}
            </div>
          </div>

          {/* Today's Goals summary chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatChip
              icon={Flame}
              iconColor="bg-primary"
              label="Calories Burned"
              value={`${calsBurned} / 1,200 kcal`}
              dot dotColor="bg-primary"
            />
            <StatChip
              icon={Droplets}
              iconColor="bg-sky-500"
              label="Water Intake"
              value={`${(waterMl / 1000).toFixed(1)} / ${(waterGoal / 1000).toFixed(1)} L`}
              dot dotColor="bg-sky-400"
            />
            <StatChip
              icon={Footprints}
              iconColor="bg-violet-500"
              label="Steps Today"
              value="— steps"
              dot dotColor="bg-violet-400"
            />
            <StatChip
              icon={Scale}
              iconColor="bg-emerald-600"
              label="Weight"
              value={weightData.length ? `${weightData[weightData.length - 1].weight_kg ?? weightData[weightData.length - 1].weight} kg` : "— kg"}
              dot dotColor="bg-emerald-400"
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

                    {!planData ? (
                      <p className="text-sm text-muted">Loading plan…</p>
                    ) : !todayPlanDay || todayPlanDay.is_rest ? (
                      <>
                        <h3 className="text-lg font-black text-foreground leading-tight">Rest Day 😴</h3>
                        <p className="text-sm text-muted mt-0.5">{DAY_NAMES_FULL[todayDayIdx]} · Recovery day</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-black text-foreground leading-tight">
                          {todayPlanDay.focus ?? "Workout"}
                        </h3>
                        <p className="text-sm text-muted mt-0.5">
                          {todayPlanDay.estimated_duration_mins
                            ? `${todayPlanDay.estimated_duration_mins} min · `
                            : ""}
                          {todayPlanDay.exercises?.length ?? 0} exercise{(todayPlanDay.exercises?.length ?? 0) !== 1 ? "s" : ""}
                        </p>
                      </>
                    )}
                  </div>

                  <Link
                    to="/workouts/plan"
                    className="shrink-0 flex items-center gap-2 bg-primary hover:opacity-90 transition-opacity text-foreground text-sm font-bold px-4 py-2.5 rounded-xl"
                  >
                    <Play size={14} className="fill-white" />
                    {todayPlanDay && !todayPlanDay.is_rest ? "Start" : "Plan"}
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Weight Trend Chart */}
            <motion.div variants={slideIn("left")} initial="hidden" animate="visible">
              <WeightTrendChart
                data={weightData.map((d) => ({ day: d.day, weight: d.weight_kg ?? d.weight }))}
                domain={weightDomain}
                range={weightRange}
                onRangeChange={setWeightRange}
                height={isMobile ? 140 : 160}
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
                  {Math.round(macros.calories_consumed)} / {macros.goal_calories} kcal
                </span>
              </div>
              <div className="space-y-3">
                <MacroRow label="Protein"       current={Math.round(macros.protein_g)} goal={150}                   unit="g"    barColor="bg-primary"      />
                <MacroRow label="Carbohydrates" current={Math.round(macros.carbs_g)}   goal={250}                   unit="g"    barColor="bg-sky-500"      />
                <MacroRow label="Fat"           current={Math.round(macros.fat_g)}     goal={65}                    unit="g"    barColor="bg-violet-500"   />
                <MacroRow label="Calories"      current={Math.round(macros.calories_consumed)} goal={macros.goal_calories} unit=" kcal" barColor="bg-emerald-500" />
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
                  🔥 {streak} day streak
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
