import { Clock, Pencil, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import { categoryColor, todayDay } from "../../pages/workoutPlan/workoutPlanData";

const FOCUS_OPTIONS = [
  "Chest & Triceps",
  "Back & Biceps",
  "Legs",
  "Shoulders",
  "Full Body",
  "Cardio",
  "Core",
];

export default function AccordionDay({
  dayData,
  isEditing = false,
  onEditExercise,
  onDeleteExercise,
  onReorder,
  onToggleRest,
  onChangeFocus,
  onOpenAddExercise,
}) {
  const colors  = categoryColor[dayData.category];
  const isToday = dayData.day === todayDay;

  return (
    <Collapsible>
      <div
        className={`bg-overlay/5 border rounded-2xl overflow-hidden transition-colors ${
          isToday ? "border-primary/30" : "border-border/10"
        }`}
      >
        {/* Trigger row */}
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-4 px-5 py-4 hover:bg-overlay/5 transition-colors group">
            <div className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-foreground">{dayData.day}</span>
                {isToday && (
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </div>
              {dayData.isRest ? (
                <span className="text-xs text-subtle">Rest Day</span>
              ) : (
                <span className={`text-xs font-semibold ${colors.text}`}>
                  {dayData.duration} min · {dayData.exercises.length} exercises
                </span>
              )}
            </div>
            {!dayData.isRest && (
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}
              >
                {dayData.category}
              </span>
            )}
            <ChevronDown
              size={16}
              className="text-muted shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </div>
        </CollapsibleTrigger>

        {/* Collapsible content */}
        <CollapsibleContent>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── Edit-mode toolbar ── */}
              {isEditing && (
                <div className="border-t border-border/5 px-5 py-3 flex flex-wrap items-center gap-2">
                  {/* Toggle Rest chip */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!dayData.isRest && dayData.exercises.length > 0) {
                        if (!window.confirm(`Clear all exercises on ${dayData.day} and set as rest day?`)) return;
                      }
                      onToggleRest(dayData.day);
                    }}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                      dayData.isRest
                        ? "bg-blue-500/15 border-blue-500/30 text-blue-400 hover:bg-blue-500/25"
                        : "bg-primary/15 border-primary/30 text-primary hover:bg-primary/25"
                    }`}
                  >
                    {dayData.isRest ? "Rest Day — tap to make Workout" : "Workout Day — tap to make Rest"}
                  </button>

                  {/* Change Focus select */}
                  {!dayData.isRest && (
                    <select
                      value={dayData.focus ?? ""}
                      onChange={(e) => onChangeFocus(dayData.day, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-bold bg-overlay/5 border border-border/10 text-foreground/80 rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:bg-overlay/10 transition-colors"
                    >
                      <option value="" disabled>
                        Change Focus…
                      </option>
                      {FOCUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-elevated">
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Add Exercise button */}
                  {!dayData.isRest && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAddExercise(dayData.day);
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl hover:bg-green-500/20 transition-colors"
                    >
                      <Plus size={12} />
                      Add Exercise
                    </button>
                  )}
                </div>
              )}

              {/* ── Exercise list / Rest message ── */}
              {dayData.isRest ? (
                <div className="border-t border-border/5 px-5 py-4">
                  <p className="text-xs text-subtle">
                    Rest and recover. No exercises scheduled.
                  </p>
                </div>
              ) : (
                <div className="border-t border-border/5 divide-y divide-border/5">
                  {dayData.exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="flex items-center gap-4 px-5 py-3 group hover:bg-overlay/5 transition-colors"
                    >
                      {/* Reorder arrows (edit mode only) */}
                      {isEditing && (
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            onClick={() => onReorder(dayData.day, ex.id, "up")}
                            disabled={idx === 0}
                            className="w-6 h-6 rounded bg-overlay/10 hover:bg-overlay/15 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronUp size={13} className="text-muted" />
                          </button>
                          <button
                            onClick={() => onReorder(dayData.day, ex.id, "down")}
                            disabled={idx === dayData.exercises.length - 1}
                            className="w-6 h-6 rounded bg-overlay/10 hover:bg-overlay/15 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronDown size={13} className="text-muted" />
                          </button>
                        </div>
                      )}

                      <img
                        src={ex.img}
                        alt={ex.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{ex.name}</p>
                        <p className="text-xs text-muted">
                          {ex.sets} sets{ex.reps ? ` · ${ex.reps} reps` : " · Timed"}
                        </p>
                      </div>

                      {/* Edit / Delete buttons */}
                      <div
                        className={`flex items-center gap-1 transition-opacity ${
                          isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <button
                          onClick={() => onEditExercise(ex)}
                          className="w-7 h-7 rounded-full bg-overlay/5 hover:bg-primary/10 border border-border/10 flex items-center justify-center transition-colors"
                        >
                          <Pencil size={12} className="text-muted" />
                        </button>
                        <button
                          onClick={() => onDeleteExercise(dayData.day, ex.id)}
                          className="w-7 h-7 rounded-full bg-overlay/5 hover:bg-red-500/10 border border-border/10 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={12} className="text-muted" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="px-5 py-2.5 flex items-center gap-2">
                    <Clock size={12} className="text-muted" />
                    <span className="text-xs text-muted">
                      Total: {dayData.duration} min
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
