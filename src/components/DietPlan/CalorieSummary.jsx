import { Beef, Wheat, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import { macros } from "../../pages/DietPlan/dietPlanData";

function MacroBar({ label, current, goal, color, icon: Icon }) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon size={13} style={{ color }} />
          <span className="text-xs font-bold text-foreground/80">{label}</span>
        </div>
        <span className="text-xs text-muted font-semibold">{current}g / {goal}g</span>
      </div>
      <div className="h-2 bg-overlay/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function CalorieDonut({ consumed, goal }) {
  const pct = Math.min((consumed / goal) * 100, 100);
  const data = [
    { name: "consumed",  value: pct,         fill: "#f97316" },
    { name: "remaining", value: 100 - pct,   fill: "rgba(255,255,255,0.06)" },
  ];

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%" outerRadius="100%"
          data={data} startAngle={90} endAngle={-270} barSize={10}
        >
          <RadialBar dataKey="value" cornerRadius={10} background={false} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-black text-foreground">{consumed}</span>
        <span className="text-[10px] text-muted font-semibold">kcal</span>
      </div>
    </div>
  );
}

export default function CalorieSummary({ meals, goal }) {
  const totalConsumed = meals.reduce((acc, m) => acc + m.calories, 0);

  return (
    <div className="space-y-4">
      {/* Calorie donut card */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5 flex flex-col items-center gap-4">
        <p className="text-sm font-black text-foreground self-start">Calories</p>
        <CalorieDonut consumed={totalConsumed} goal={goal} />
        <div className="w-full space-y-2">
          {[
            { label: "Consumed",  value: `${totalConsumed} kcal`, cls: "text-foreground font-black"  },
            { label: "Goal",      value: `${goal} kcal`,          cls: "text-muted font-semibold" },
            {
              label: "Remaining",
              value: `${Math.max(goal - totalConsumed, 0)} kcal`,
              cls: totalConsumed > goal ? "text-red-400 font-black" : "text-green-400 font-black",
            },
          ].map(({ label, value, cls }) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-muted">{label}</span>
              <span className={cls}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Macros card */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5 space-y-4">
        <p className="text-sm font-black text-foreground">Nutritional Breakdown</p>
        <MacroBar {...macros.protein} icon={Beef}     />
        <MacroBar {...macros.carbs}   icon={Wheat}    />
        <MacroBar {...macros.fats}    icon={Droplets} />
      </div>

      {/* By-meal breakdown */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5 space-y-3">
        <p className="text-sm font-black text-foreground">By Meal</p>
        {meals.map((meal) => (
          <div key={meal.id} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-muted">{meal.label}</span>
              <span className="font-bold text-foreground/80">{meal.calories} kcal</span>
            </div>
            <div className="h-1.5 bg-overlay/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(meal.calories / goal) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ backgroundColor: meal.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
