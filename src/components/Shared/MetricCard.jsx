export default function MetricCard({ image, value, unit, label, progress, color, goal }) {
  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="h-28 overflow-hidden">
        <img
          src={image}
          alt={label}
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xl font-black text-foreground">
              {value}
              <span className="text-sm font-semibold text-muted ml-1">{unit}</span>
            </p>
            <p className="text-xs text-muted mt-0.5">{label}</p>
          </div>
          <span className="text-[11px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full shrink-0">
            ↑ 12%
          </span>
        </div>

        <div className="space-y-1">
          <div className="h-1.5 bg-overlay/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>
          {goal && <p className="text-[10px] text-subtle">Goal: {goal}</p>}
        </div>
      </div>
    </div>
  );
}
