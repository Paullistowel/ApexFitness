import { Flame, RotateCcw, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";

export default function MealSection({ meal, defaultOpen = false, onReplace }) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <div className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden">
        {/* Header trigger */}
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between px-5 py-4 hover:bg-overlay/5 transition-colors group">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: meal.color + "22" }}
              >
                <Flame size={16} style={{ color: meal.color }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-foreground">{meal.label}</p>
                <p className="text-xs text-muted">{meal.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-black px-3 py-1 rounded-full"
                style={{ backgroundColor: meal.color + "22", color: meal.color }}
              >
                {meal.calories} kcal
              </span>
              <ChevronDown
                size={16}
                className="text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </div>
          </div>
        </CollapsibleTrigger>

        {/* Expanded items */}
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/5"
          >
            <div className="px-5 py-3 space-y-3">
              {meal.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.dot }} />
                    <span className="text-sm text-foreground/80">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted">{item.kcal} kcal</span>
                    <ChevronRight size={13} className="text-gray-700" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="px-5 pb-4">
              <button
                onClick={() => onReplace(meal.id)}
                className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary transition-colors"
              >
                <RotateCcw size={13} />
                Replace Meal
              </button>
            </div>
          </motion.div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
