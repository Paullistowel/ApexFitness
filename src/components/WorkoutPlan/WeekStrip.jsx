import { motion } from "framer-motion";
import { categoryColor, todayDay } from "../../pages/workoutPlan/workoutPlanData";

export default function WeekStrip({ plan, activeDay, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {plan.map((d, i) => {
        const colors   = categoryColor[d.category];
        const isToday  = d.day === todayDay;
        const isActive = d.day === activeDay;

        return (
          <motion.button
            key={d.day}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onSelect(d.day)}
            className={`shrink-0 min-w-[72px] flex-1 rounded-2xl p-3 flex flex-col items-center gap-1.5 border-2 transition-colors ${
              isActive
                ? `${colors.bg} ${colors.border}`
                : "bg-overlay/5 border-border/10 hover:bg-overlay/8"
            }`}
          >
            <span className={`text-[11px] font-bold uppercase tracking-wide ${isActive ? colors.text : "text-muted"}`}>
              {d.short}
            </span>
            {isToday && (
              <span className="text-[9px] font-black text-primary uppercase tracking-wider">Today</span>
            )}
            <div className={`w-2 h-2 rounded-full ${isActive ? colors.dot : "bg-gray-700"}`} />
            <span className={`text-[10px] font-semibold ${isActive ? colors.text : "text-subtle"}`}>
              {d.isRest ? "Rest" : d.category}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
