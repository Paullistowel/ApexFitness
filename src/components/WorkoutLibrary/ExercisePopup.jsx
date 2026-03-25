import {
  X,
  Bookmark,
  BookmarkCheck,
  Clock,
  Flame,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  categoryConfig,
  levelColor,
} from "../../pages/WorkoutLibrary/workoutData";

export default function ExercisePopup({
  exercise,
  onClose,
  onBookmark,
  bookmarked,
  onStart,
}) {
  const CatIcon = categoryConfig[exercise.category]?.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative bg-elevated border border-border/10 rounded-3xl overflow-hidden w-full max-w-lg shadow-2xl z-10"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        {/* Image */}
        <div className="relative h-56">
          <img
            src={exercise.img}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X size={16} className="text-foreground" />
          </button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onBookmark(exercise.id)}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            {bookmarked ? (
              <BookmarkCheck size={16} className="text-primary" />
            ) : (
              <Bookmark size={16} className="text-foreground" />
            )}
          </motion.button>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-foreground ${categoryConfig[exercise.category]?.bg}`}
              >
                {exercise.category}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColor[exercise.level]}`}
              >
                {exercise.level}
              </span>
            </div>
            <h2 className="text-2xl font-black text-foreground">{exercise.name}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Clock, label: "Duration", value: exercise.duration },
              {
                icon: Flame,
                label: "Calories",
                value: `~${exercise.calories} kcal`,
              },
              { icon: CatIcon, label: "Type", value: exercise.type },
            ].map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                className="bg-overlay/5 border border-border/10 rounded-2xl p-3 text-center"
              >
                <Icon size={16} className="text-primary mx-auto mb-1" />
                <p className="text-sm font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Muscles */}
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
              Muscles Targeted
            </p>
            <div className="flex flex-wrap gap-2">
              {exercise.muscles.map((m, i) => (
                <motion.span
                  key={m}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full"
                >
                  {m}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
              Instructions
            </p>
            <p className="text-sm text-muted leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="w-full py-3.5 bg-primary hover:bg-primary text-foreground font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            Start This Exercise
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
