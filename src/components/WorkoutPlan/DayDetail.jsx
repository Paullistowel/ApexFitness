import { Clock, Play, Pencil, Trash2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categoryColor } from "../../pages/workoutPlan/workoutPlanData";

export default function DayDetail({ dayData, onEditExercise, onDeleteExercise, onStartWorkout }) {
  const colors = categoryColor[dayData.category];

  if (dayData.isRest) {
    return (
      <motion.div
        key="rest"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
        className="bg-overlay/5 border border-border/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-3"
      >
        <div className="w-16 h-16 rounded-2xl bg-overlay/5 border border-border/10 flex items-center justify-center">
          <RotateCcw size={28} className="text-subtle" />
        </div>
        <p className="text-base font-black text-muted">Rest Day</p>
        <p className="text-xs text-subtle text-center max-w-xs">
          Recovery is just as important as training. Rest, hydrate and prepare for tomorrow.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={dayData.day}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden"
    >
      {/* Day header */}
      <div className={`px-5 py-4 flex items-center justify-between ${colors.bg} border-b ${colors.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
          <div>
            <h3 className="text-sm font-black text-foreground">{dayData.day}</h3>
            <p className={`text-xs font-semibold ${colors.text}`}>
              {dayData.category} · {dayData.duration} min · {dayData.exercises.length} exercises
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartWorkout}
          className="flex items-center gap-2 bg-primary hover:bg-primary text-foreground text-xs font-bold px-4 py-2 rounded-full transition-colors"
        >
          <Play size={12} />
          Start
        </motion.button>
      </div>

      {/* Exercise rows */}
      <div className="divide-y divide-border/5">
        <AnimatePresence initial={false}>
          {dayData.exercises.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12, height: 0 }}
              transition={{ delay: i * 0.05, duration: 0.22 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-overlay/5 transition-colors group"
            >
              <img src={ex.img} alt={ex.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{ex.name}</p>
                <p className="text-xs text-muted mt-0.5">
                  {ex.sets} sets{ex.reps ? ` · ${ex.reps} reps` : " · Timed"}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEditExercise(ex)}
                  className="w-8 h-8 rounded-full bg-overlay/5 hover:bg-primary/10 border border-border/10 flex items-center justify-center transition-colors"
                >
                  <Pencil size={13} className="text-muted hover:text-primary" />
                </button>
                <button
                  onClick={() => onDeleteExercise(ex.id)}
                  className="w-8 h-8 rounded-full bg-overlay/5 hover:bg-red-500/10 border border-border/10 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={13} className="text-muted hover:text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border/5 flex items-center gap-2">
        <Clock size={13} className="text-muted" />
        <span className="text-xs text-muted font-semibold">Total workout time: {dayData.duration} min</span>
      </div>
    </motion.div>
  );
}
