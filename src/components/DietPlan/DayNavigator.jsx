import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { DAYS, FULL_DATES, TODAY_IDX } from "../../pages/DietPlan/dietPlanData";

const FULL_DAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function DayNavigator({ dayIdx, onSelect, onPrev, onNext }) {
  const isToday = dayIdx === TODAY_IDX;

  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl p-4 space-y-4">
      {/* Week strip */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d, i) => (
          <motion.button
            key={d}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(i)}
            className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
              dayIdx === i
                ? "bg-primary text-foreground"
                : "hover:bg-overlay/5 text-muted"
            }`}
          >
            <span className="text-[11px] font-bold uppercase">{d}</span>
            <span className={`text-xs font-semibold ${dayIdx === i ? "text-primary" : "text-subtle"}`}>
              {FULL_DATES[i].split(" ")[1]}
            </span>
            {i === TODAY_IDX && (
              <div className={`w-1.5 h-1.5 rounded-full ${dayIdx === i ? "bg-white" : "bg-primary"}`} />
            )}
          </motion.button>
        ))}
      </div>

      {/* Arrow navigation + date title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={dayIdx === 0}
          className="w-8 h-8 rounded-full border border-border/10 bg-overlay/5 flex items-center justify-center disabled:opacity-30 hover:bg-overlay/10 transition-colors"
        >
          <ChevronLeft size={15} className="text-muted" />
        </button>
        <div className="text-center">
          <p className="text-sm font-black text-foreground">
            {FULL_DAY_NAMES[dayIdx]}, {FULL_DATES[dayIdx]} 2026
          </p>
          {isToday && (
            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>
        <button
          onClick={onNext}
          disabled={dayIdx === 6}
          className="w-8 h-8 rounded-full border border-border/10 bg-overlay/5 flex items-center justify-center disabled:opacity-30 hover:bg-overlay/10 transition-colors"
        >
          <ChevronRight size={15} className="text-muted" />
        </button>
      </div>
    </div>
  );
}
