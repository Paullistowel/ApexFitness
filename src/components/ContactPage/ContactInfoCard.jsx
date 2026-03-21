import { motion } from "framer-motion";

export default function ContactInfoCard({ icon: Icon, label, value, sub, color, bg, index }) {
  return (
    <motion.div
      className="rounded-2xl bg-overlay/5 border border-border/5 hover:border-primary/30 p-6 flex flex-col gap-4 transition-all duration-300 group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-muted text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className="text-foreground font-semibold">{value}</p>
        <p className="text-muted text-sm mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}
