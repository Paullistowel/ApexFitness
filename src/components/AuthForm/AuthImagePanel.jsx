import { motion } from "framer-motion";
import GymImage from "../../Assets/image7.jpeg";

export default function AuthImagePanel({ quote, animate = false }) {
  const ImageEl = animate ? motion.img : "img";
  const animateProps = animate
    ? { initial: { opacity: 0, scale: 1.08 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.2, ease: "easeOut" } }
    : {};

  return (
    <div className="relative hidden flex-1 md:flex">
      <ImageEl
        src={GymImage}
        alt="Gym"
        className="absolute inset-0 h-full w-full object-cover"
        {...animateProps}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.16)_55%,rgba(0,0,0,0.58)_100%)]" />
      <div className="absolute inset-y-0 right-0 w-24 bg-[linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.55))]" />
      <div className="absolute bottom-12 left-10 right-10">
        <p className="text-2xl font-bold text-white leading-snug drop-shadow">
          "{quote}"
        </p>
        <p className="mt-2 text-orange-400 text-sm font-medium">— Apex Fitness</p>
      </div>
    </div>
  );
}
