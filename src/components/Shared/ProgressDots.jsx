export default function ProgressDots({ active, total = 2 }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <span
          key={n}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            active === n ? "w-7 bg-orange-500" : "w-7 bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}
