import { Bookmark, BookmarkCheck, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import {
  categoryConfig,
  levelColor,
} from "../../pages/WorkoutLibrary/workoutData";

export default function ExerciseCard({
  exercise,
  onOpen,
  onBookmark,
  bookmarked,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
    >
      <Card
        className="bg-overlay/5 border-border/10 ring-0 cursor-pointer hover:bg-overlay/8 transition-colors duration-200 group gap-0 py-0 h-full"
        onClick={() => onOpen(exercise)}
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden rounded-t-xl">
          <img
            src={exercise.img}
            alt={exercise.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(exercise.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            {bookmarked ? (
              <BookmarkCheck size={15} className="text-primary" />
            ) : (
              <Bookmark size={15} className="text-foreground" />
            )}
          </motion.button>

          <div className="absolute bottom-3 left-3">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColor[exercise.level]}`}
            >
              {exercise.level}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-foreground leading-tight">
              {exercise.name}
            </h3>
            <span
              className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-foreground ${categoryConfig[exercise.category]?.bg}`}
            >
              {exercise.category}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {exercise.duration}
            </span>
            <span className="flex items-center gap-1">
              <Flame size={11} /> ~{exercise.calories} kcal
            </span>
            <span>{exercise.type}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
