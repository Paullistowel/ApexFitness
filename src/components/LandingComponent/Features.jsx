import { Dumbbell, Salad, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: ClipboardList,
    title: "PROGRAM",
    description:
      "Get a customized workout plan designed to match your goals and fitness level.",
    iconColor: "#BA7517",
    iconBg: "#FAEEDA",
    accent: false,
  },
  {
    icon: Dumbbell,
    title: "WORKOUT",
    description:
      "Access expert-guided strength, cardio and flexibility training programs.",
    iconColor: "#A32D2D",
    iconBg: "#FCEBEB",
    accent: true,
  },
  {
    icon: Salad,
    title: "NUTRITION",
    description:
      "Fuel your body right with personalized meal plans and dietary advice.",
    iconColor: "#3B6D11",
    iconBg: "#EAF3DE",
    accent: false,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#1a0f08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-[#BA7517] text-sm font-semibold tracking-widest uppercase mb-2">
            Our Best Features
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            WHY <span className="text-[#A32D2D]">CHOOSE</span> US?
          </h2>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: feature.accent
                  ? "1px solid rgba(163,45,45,0.5)"
                  : "0.5px solid rgba(255,255,255,0.08)",
                boxShadow: feature.accent
                  ? "0 0 0 1px rgba(163,45,45,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "none",
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: feature.iconBg }}
              >
                <feature.icon size={26} style={{ color: feature.iconColor }} />
              </div>
              <h3
                className="text-lg font-bold mb-3 tracking-wider"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  color: feature.accent ? "#F09595" : "white",
                }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
