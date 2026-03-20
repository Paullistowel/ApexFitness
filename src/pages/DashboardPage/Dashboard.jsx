import { useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import {
  Play, BookOpen, CalendarDays, ClipboardList, Droplets,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

import CalorieImg from "../../Assets/Reverse Crunch.jpg";
import WaterImg   from "../../Assets/Side Plank.jpg";
import ActiveImg  from "../../Assets/Camel Pose.jpg";
import MetricCard from "../../components/Shared/MetricCard";

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

// ─── Quick Action ─────────────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label }) {
  return (
    <button className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
        <Icon size={16} className="text-orange-500 group-hover:text-white transition-colors" />
      </div>
      <span className="text-[11px] sm:text-xs font-medium text-gray-400 group-hover:text-white text-center leading-tight transition-colors">
        {label}
      </span>
    </button>
  );
}

const tooltipStyle = {
  fontSize: 11, borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "#1d1a17", color: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [weightRange, setWeightRange] = useState("7 days");
  const [activityTab, setActivityTab] = useState("Steps");

  const weightData        = weightRange === "7 days" ? weight7 : weight30;
  const weightDomain      = weightRange === "7 days" ? [80, 87] : [80, 91];
  const activityData      = activityTab === "Steps" ? stepsData : workoutData;
  const activityFormatter = activityTab === "Steps"
    ? (v) => [v.toLocaleString(), "Steps"]
    : (v) => [`${v} min`, "Workout"];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">

      {/* ── Header ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Welcome Back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Emmanuel
            </span>{" "}
            👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's your progress today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-gray-400 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Tuesday, March 3 2026
        </div>
      </motion.div>

      {/* ── Today's Overview ── */}
      <div>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
          className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3"
        >
          Today's Overview
        </motion.h2>
        <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
          {[
            { image: CalorieImg, value: "450",  unit: "kcal", label: "Burned today",    progress: 45, color: "#f97316" },
            { image: WaterImg,   value: "8.5",  unit: "L",    label: "Water Consumed",  progress: 70, color: "#38bdf8" },
            { image: ActiveImg,  value: "35",   unit: "min",  label: "Active Minutes",  progress: 78, color: "#a78bfa", goal: "45 min" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} custom={i}
            >
              <MetricCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Performance Charts ── */}
      <div>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3"
        >
          Performance
        </motion.h2>
        <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>

          {/* Weight Trend */}
          <motion.div
            variants={slideIn("left")} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-white">Weight Trend</p>
                {weightRange === "30 days" && (
                  <p className="text-[11px] text-gray-500 mt-0.5">−9 kg over 30 days</p>
                )}
              </div>
              <div className="flex gap-1">
                {["7 days", "30 days"].map((r) => (
                  <button
                    key={r} onClick={() => setWeightRange(r)}
                    className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                      weightRange === r ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={isMobile ? 140 : 160}>
              <AreaChart data={weightData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} interval={weightRange === "30 days" ? 4 : 0} />
                <YAxis domain={weightDomain} tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, "Weight"]} />
                <Area type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={2} fill="url(#wGrad)"
                  dot={weightRange === "7 days" ? { fill: "#f97316", r: 3 } : false} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Active Summary */}
          <motion.div
            variants={slideIn("right")} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-white">Active Summary</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {activityTab === "Steps" ? "Daily steps this week" : "Workout minutes this week"}
                </p>
              </div>
              <div className="flex gap-1">
                {["Steps", "Workout"].map((t) => (
                  <button
                    key={t} onClick={() => setActivityTab(t)}
                    className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                      activityTab === t ? "bg-white/20 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={isMobile ? 140 : 160}>
              <BarChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={18}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={activityFormatter} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {activityData.map((_, index) => (
                    <Cell key={index} fill={index === activityData.length - 1 ? "#f97316" : "rgba(249,115,22,0.25)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3"
        >
          Quick Actions
        </motion.h2>
        <div className={`grid gap-3 ${isMobile ? "grid-cols-3" : "grid-cols-6"}`}>
          {[
            { icon: Play,          label: "Start Workout"   },
            { icon: ClipboardList, label: "Diet Plan"       },
            { icon: ClipboardList, label: "Log Meal"        },
            { icon: Droplets,      label: "Water Tracker"   },
            { icon: BookOpen,      label: "Workout Library" },
            { icon: CalendarDays,  label: "Workout Plan"    },
          ].map((action, i) => (
            <motion.div
              key={action.label}
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} custom={i * 0.5}
            >
              <QuickAction {...action} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
