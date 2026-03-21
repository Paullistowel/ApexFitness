import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const CONFIG = {
  success: { icon: CheckCircle2, bar: "bg-green-500",  icon_cls: "text-green-500"  },
  error:   { icon: XCircle,      bar: "bg-red-500",    icon_cls: "text-red-500"    },
  warning: { icon: AlertTriangle,bar: "bg-yellow-500", icon_cls: "text-yellow-500" },
  info:    { icon: Info,         bar: "bg-primary",    icon_cls: "text-primary"    },
};

export default function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-80">
      <AnimatePresence>
        {toasts.map((t) => {
          const { icon: Icon, bar, icon_cls } = CONFIG[t.type] ?? CONFIG.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0,  scale: 1    }}
              exit={{    opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative bg-elevated border border-border/10 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden"
            >
              {/* Content */}
              <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                <Icon size={18} className={`${icon_cls} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground leading-snug">{t.title}</p>
                  {t.message && (
                    <p className="text-xs text-muted mt-0.5 leading-snug">{t.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="shrink-0 w-6 h-6 rounded-full bg-overlay/5 hover:bg-overlay/15 flex items-center justify-center transition-colors"
                >
                  <X size={11} className="text-muted" />
                </button>
              </div>

              {/* Progress bar */}
              <motion.div
                className={`h-0.5 ${bar} origin-left`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: t.duration / 1000, ease: "linear" }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
