import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  fontSize: 11, borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "#1d1a17", color: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
};

/**
 * WeightTrendChart
 * @param {object[]} data          - array of { day, weight }
 * @param {[number,number]} domain - YAxis domain e.g. [80, 87]
 * @param {string}  range          - active range label ("7 days" | "30 days")
 * @param {function} onRangeChange - called with new range string
 * @param {number}  height         - chart height in px (default 160)
 * @param {string}  subtitle       - optional subtitle below title
 */
export default function WeightTrendChart({
  data,
  domain = [80, 87],
  range = "7 days",
  onRangeChange,
  height = 160,
  subtitle,
}) {
  const ranges = ["7 days", "30 days"];

  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-foreground">Weight Trend</p>
          {subtitle && <p className="text-[11px] text-muted mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange?.(r)}
              className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                range === r
                  ? "bg-primary text-foreground"
                  : "bg-overlay/5 text-muted hover:bg-overlay/10"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="wTrendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false} tickLine={false}
            interval={range === "30 days" ? 4 : 0}
          />
          <YAxis
            domain={domain}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => [`${v} kg`, "Weight"]}
          />
          <Area
            type="monotone" dataKey="weight"
            stroke="#f97316" strokeWidth={2}
            fill="url(#wTrendGrad)"
            dot={range === "7 days" ? { fill: "#f97316", r: 3 } : false}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
