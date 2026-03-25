import { useState, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useQuery, useMutation } from "@tanstack/react-query";
import DayNavigator from "../../components/DietPlan/DayNavigator";
import MealSection from "../../components/DietPlan/MealSection";
import CalorieSummary from "../../components/DietPlan/CalorieSummary";
import ReplaceMealModal from "../../components/DietPlan/ReplaceMealModal";
import GeneratePlanModal from "../../components/DietPlan/GeneratePlanModal";
import AIInsight from "../../components/DietPlan/AIInsight";
import { weekMeals, TODAY_IDX, mealPools } from "./dietPlanData";
import api from "../../lib/api";

gsap.registerPlugin(useGSAP);

// Meal slot colors and times — used when remapping a selected alternative
const MEAL_META = {
  breakfast: { color: "#f97316", time: "7:00 – 8:30 AM",  label: "Breakfast" },
  lunch:     { color: "#3b82f6", time: "12:00 – 1:30 PM", label: "Lunch"     },
  snack:     { color: "#a855f7", time: "3:00 – 4:00 PM",  label: "Snack"     },
  dinner:    { color: "#22c55e", time: "7:00 – 8:30 PM",  label: "Dinner"    },
};

export default function DietPlanPage() {
  const [dayIdx,             setDayIdx]             = useState(TODAY_IDX);
  const [planData,           setPlanData]           = useState(weekMeals);
  const [replacingMeal,      setReplacingMeal]      = useState(null); // meal id string
  const [showGenerateModal,  setShowGenerateModal]  = useState(false);
  const containerRef = useRef(null);

  // Load saved plan from backend; seed state once data arrives
  const { data: savedPlan } = useQuery({
    queryKey: ["diet-plan"],
    queryFn: () => api.get("/diet/plan").then((r) => r.data),
  });

  useEffect(() => {
    if (savedPlan?.plan_data) setPlanData(savedPlan.plan_data);
  }, [savedPlan]);

  const savePlan = useMutation({
    mutationFn: (plan) => api.put("/diet/plan", { plan_data: plan }),
  });

  useGSAP(() => {
    gsap.fromTo(
      ".diet-row",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const dayData        = planData[dayIdx];
  const replacingLabel = dayData.meals.find((m) => m.id === replacingMeal)?.label;

  // ── Generate a full day or full week ──────────────────────────────────────
  const handleGenerate = ({ scope, preference, calories }) => {
    const generator = mealPools[preference] ?? mealPools["Standard"];

    if (scope === "today") {
      const newMeals = generator.generateDay(calories);
      setPlanData((prev) => {
        const next = { ...prev, [dayIdx]: { goal: calories, meals: newMeals } };
        savePlan.mutate(next);
        return next;
      });
    } else {
      const newPlan = {};
      for (let i = 0; i < 7; i++) {
        newPlan[i] = { goal: calories, meals: generator.generateDay(calories) };
      }
      setPlanData(newPlan);
      savePlan.mutate(newPlan);
    }
  };

  // ── Replace a single meal with a selected alternative ────────────────────
  const handleReplaceMeal = (selectedOption) => {
    const meta = MEAL_META[replacingMeal] ?? {};
    const dot  = meta.color ?? "#f97316";

    const newMeal = {
      id:       replacingMeal,
      label:    meta.label ?? replacingMeal,
      time:     meta.time  ?? "",
      calories: selectedOption.calories,
      color:    dot,
      items:    selectedOption.items.map((item) => ({ ...item, dot })),
    };

    setPlanData((prev) => {
      const updatedMeals = prev[dayIdx].meals.map((m) =>
        m.id === replacingMeal ? newMeal : m
      );
      const next = { ...prev, [dayIdx]: { ...prev[dayIdx], meals: updatedMeals } };
      savePlan.mutate(next);
      return next;
    });
  };

  return (
    <div ref={containerRef} className="min-h-full bg-surface p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="diet-row flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-foreground">Diet Plan</h1>
            <p className="text-sm text-muted mt-0.5">Track your daily nutrition</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary text-foreground text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <RotateCcw size={14} />
            Generate New Plan
          </motion.button>
        </div>

        {/* Day navigator */}
        <div className="diet-row">
          <DayNavigator
            dayIdx={dayIdx}
            onSelect={setDayIdx}
            onPrev={() => setDayIdx((i) => Math.max(0, i - 1))}
            onNext={() => setDayIdx((i) => Math.min(6, i + 1))}
          />
        </div>

        {/* Content — re-animates on day change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dayIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* Left — meal sections */}
            <div className="md:col-span-2 space-y-3">
              <AIInsight />
              {dayData.meals.map((meal, i) => (
                <MealSection
                  key={meal.id}
                  meal={meal}
                  defaultOpen={i === 0}
                  onReplace={(mealId) => setReplacingMeal(mealId)}
                />
              ))}
            </div>

            {/* Right — calorie + macros */}
            <CalorieSummary meals={dayData.meals} goal={dayData.goal} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Replace meal modal */}
      <AnimatePresence>
        {replacingMeal && (
          <ReplaceMealModal
            key="replace-modal"
            mealLabel={replacingLabel}
            mealId={replacingMeal}
            onConfirm={handleReplaceMeal}
            onClose={() => setReplacingMeal(null)}
          />
        )}
      </AnimatePresence>

      {/* Generate plan modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <GeneratePlanModal
            key="generate-modal"
            onGenerate={handleGenerate}
            onClose={() => setShowGenerateModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
