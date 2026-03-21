import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Dumbbell } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center">
      {/* Glow blob */}
      <div className="absolute w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative space-y-6 max-w-md"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Dumbbell size={36} className="text-primary" />
          </div>
        </div>

        {/* 404 */}
        <div>
          <p className="text-[96px] font-black leading-none text-foreground/5 select-none">
            404
          </p>
          <h1 className="text-2xl font-black text-foreground -mt-8">Page Not Found</h1>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Looks like this page skipped leg day — it doesn't exist.
            <br />Head back and keep pushing.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary text-foreground text-sm font-bold transition-colors"
          >
            <Home size={15} />
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl border border-border/10 bg-overlay/5 hover:bg-overlay/10 text-foreground/80 text-sm font-semibold transition-colors"
          >
            Landing Page
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
