import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  fontSize: 11, borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "#1d1a17", color: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
};

/**
 * ActivityChart
 * @param {object[]} data          - array of { day, value }
 * @param {string}   tab           - active tab ("Steps" | "Workout")
 * @param {string[]} tabs          - available tabs (default ["Steps","Workout"])
 * @param {function} onTabChange   - called with new tab string
 * @param {function} formatter     - recharts tooltip formatter (v) => [label, name]
 * @param {string}   subtitle      - optional subtitle below title
 * @param {number}   height        - chart height in px (default 160)
 */
export default function ActivityChart({
  data,
  tab = "Steps",
  tabs = ["Steps", "Workout"],
  onTabChange,
  formatter,
  subtitle,
  height = 160,
}) {
  const defaultFormatter = (v) => [v.toLocaleString(), tab];
  const resolvedFormatter = formatter ?? defaultFormatter;

  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-foreground">Active Summary</p>
          {subtitle && <p className="text-[11px] text-muted mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => onTabChange?.(t)}
              className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                tab === t
                  ? "bg-overlay/20 text-foreground"
                  : "bg-overlay/5 text-muted hover:bg-overlay/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={18}>
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={resolvedFormatter} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === data.length - 1 ? "#f97316" : "rgba(249,115,22,0.25)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
