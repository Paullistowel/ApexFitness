import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIInsight() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-primary mb-0.5">AI Insight</p>
            <p className="text-xs text-muted leading-relaxed">
              Increase your protein intake by ~20g to better support muscle recovery on training days.
              Consider adding Greek yogurt or a protein shake to your afternoon snack.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="shrink-0 text-subtle hover:text-muted transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
