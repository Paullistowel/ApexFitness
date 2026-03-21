import { useState } from "react";
import { X, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";

export default function EditExerciseModal({ exercise, onSave, onClose }) {
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative bg-elevated border border-border/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 space-y-5"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-foreground">Edit Exercise</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-overlay/5 border border-border/10 flex items-center justify-center hover:bg-overlay/10 transition-colors"
          >
            <X size={15} className="text-muted" />
          </button>
        </div>

        <p className="text-sm font-semibold text-primary">{exercise.name}</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Sets</label>
            <Input
              type="number"
              min={1}
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
              className="mt-1.5 h-11 bg-overlay/5 border-border/10 text-foreground focus-visible:ring-primary/30 focus-visible:border-primary/50 rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">
              Reps <span className="normal-case font-normal text-subtle">(leave blank for timed)</span>
            </label>
            <Input
              type="number"
              min={1}
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="e.g. 10"
              className="mt-1.5 h-11 bg-overlay/5 border-border/10 text-foreground placeholder:text-gray-700 focus-visible:ring-primary/30 focus-visible:border-primary/50 rounded-xl"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-border/10 bg-overlay/5 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/10 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onSave({ ...exercise, sets, reps: reps === "" ? null : Number(reps) })}
            className="flex-1 py-3 bg-primary hover:bg-primary rounded-2xl text-sm font-bold text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <Check size={15} />
            Save
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
