import { Sparkles, Dumbbell, Salad, Flame, Zap, HelpCircle } from "lucide-react";

export const AI_NAME     = "Apex AI Coach";
export const AI_SUBTITLE = "Your personal fitness assistant · Always available";

export const INITIAL_MESSAGES = [
  {
    id: 1,
    from: "ai",
    text: "Hey! 👋 I'm your Apex AI Coach — your personal fitness assistant.\n\nI can help you with workout plans, nutrition advice, exercise form, recovery tips, and anything fitness-related.\n\nWhat would you like to work on today?",
    time: "",
  },
];

export const SUGGESTED_PROMPTS = [
  { icon: Dumbbell,   label: "Create a workout plan for me"      },
  { icon: Salad,      label: "What should I eat to lose weight?" },
  { icon: Zap,        label: "Best exercises for beginners"      },
  { icon: HelpCircle, label: "How much protein do I need?"       },
  { icon: Flame,      label: "Cardio or weights for fat loss?"   },
  { icon: Dumbbell,   label: "Help me build muscle fast"         },
];

export function getAIResponse(text) {
  const q = text.toLowerCase();
  if (q.includes("workout plan") || q.includes("training plan"))
    return "Here's a balanced 4-day plan:\n\n💪 Day 1 — Push (Chest · Shoulders · Triceps)\n• Bench Press 4×8\n• Shoulder Press 3×10\n• Tricep Dips 3×12\n\n🔁 Day 2 — Pull (Back · Biceps)\n• Pull-ups 4×8\n• Barbell Row 3×10\n• Bicep Curls 3×12\n\n🦵 Day 3 — Legs\n• Squats 4×8\n• Romanian Deadlift 3×10\n• Walking Lunges 3×12 each\n\n🔥 Day 4 — HIIT Cardio (30 min)\n\nWant me to adjust this for fat loss or muscle gain?";
  if (q.includes("lose weight") || q.includes("weight loss") || q.includes("fat loss"))
    return "Fat loss comes down to a few key things:\n\n🍽️ Nutrition (80% of the battle)\n• Eat in a calorie deficit (300–500 kcal below maintenance)\n• Prioritise protein — aim for 1.6–2g per kg of bodyweight\n• Cut liquid calories\n\n🏃 Exercise\n• 3–4 strength sessions per week\n• Add 2–3 low-intensity cardio sessions\n\n😴 Recovery\n• Sleep 7–9 hours\n• Manage stress to keep cortisol low\n\nWhat's your current diet like?";
  if (q.includes("build muscle") || q.includes("muscle gain") || q.includes("bulk"))
    return "To build muscle effectively:\n\n📈 Key principles:\n• Progressive overload — add weight or reps each week\n• Caloric surplus — eat 200–300 kcal above maintenance\n• High protein — 2g per kg of bodyweight daily\n\n🏋️ Best exercises:\n• Compound lifts: Squat, Deadlift, Bench Press, Rows\n• Train each muscle 2× per week\n• 3–4 sets of 6–12 reps\n\nWhat's your current training frequency?";
  if (q.includes("protein") || q.includes("how much protein"))
    return "Protein targets:\n\n🥩 How much:\n• General health: 0.8g per kg\n• Active / gym-goer: 1.6–2g per kg\n• Cutting: up to 2.4g per kg\n\n🍗 Best sources:\n• Chicken, eggs, Greek yogurt\n• Tuna, salmon, beef\n• Whey protein (post-workout)\n• Tofu, lentils, chickpeas (plant-based)\n\nNeed a sample meal plan?";
  if (q.includes("beginner") || q.includes("start") || q.includes("new to gym"))
    return "Welcome! Here's a beginner approach:\n\n📅 3 days/week (Mon · Wed · Fri)\n\n🔰 Full Body Routine:\n• Goblet Squat 3×12\n• Push-ups 3×10\n• Dumbbell Row 3×10 each\n• Romanian Deadlift 3×12\n• Plank 3×30s\n\n📝 Tips:\n• Focus on form before weight\n• Rest 60–90s between sets\n• Track your workouts\n\nYou'll see results in 4–6 weeks. What equipment do you have?";
  if (q.includes("cardio") || q.includes("running") || q.includes("hiit"))
    return "⚡ HIIT — Burns more in less time, great for fat loss. 20–30 min, 2–3×/week\n\n🚶 Steady-State — Better for heart health, lower injury risk. 30–45 min walks/cycling\n\n🏋️ Weights — Builds muscle which raises resting metabolism\n\n💡 Best combo: 3–4 strength + 2 cardio sessions/week\n\nWhat's your main goal?";
  if (q.includes("diet") || q.includes("eat") || q.includes("food") || q.includes("meal"))
    return "Top nutrition principles:\n\n✅ Do this:\n• Eat mostly whole foods\n• Hit your protein target daily\n• Stay hydrated — 2.5L+ water/day\n\n❌ Minimise:\n• Ultra-processed foods\n• Sugary drinks and alcohol\n\n🍽️ Simple plate:\n• ½ — vegetables\n• ¼ — lean protein\n• ¼ — complex carbs\n\nWant a tailored meal plan?";
  if (q.includes("sore") || q.includes("pain") || q.includes("recovery"))
    return "Recover faster:\n\n🛌 Sleep 7–9 hours (most important)\n🥩 Eat enough protein\n💧 Stay hydrated — 2.5–3L/day\n🧘 Active recovery — light walking or stretching on rest days\n🧊 Contrast showers reduce inflammation\n\nIf pain is sharp or joint-based, rest it and see a physio.";
  if (q.includes("sleep") || q.includes("rest"))
    return "Sleep is the most underrated performance tool:\n\n🧠 While you sleep:\n• HGH is released — builds muscle\n• Muscle tissue repairs\n• Cortisol drops\n\n😴 Aim for 7–9 hours with consistent sleep/wake times\n\n📱 Tips:\n• No screens 1hr before bed\n• Cool, dark room\n• Avoid caffeine after 2pm\n• Magnesium glycinate helps";
  if (q.includes("water") || q.includes("hydrat"))
    return "💧 How much water:\n• General: 35ml per kg bodyweight\n• Add 500–750ml per hour of exercise\n\n⚠️ Signs of dehydration:\n• Dark yellow urine\n• Headaches during workouts\n• Decreased strength\n\n💡 Tips:\n• Start morning with 500ml\n• Carry a bottle everywhere\n• Add electrolytes if sweating heavily";
  if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
    return "Hey there! 👋 Great to see you. Ask me about:\n• 🏋️ Workout plans\n• 🥗 Nutrition and meals\n• 💊 Supplements and recovery\n• 📈 Progress and goals\n\nWhat's on your mind?";
  if (q.includes("supplement") || q.includes("creatine") || q.includes("whey"))
    return "Only supplements with strong science backing:\n\n🥇 Highly effective:\n• Creatine Monohydrate — 3–5g/day\n• Whey Protein — post-workout\n• Caffeine — 200–400mg pre-workout\n\n🥈 Useful:\n• Vitamin D\n• Omega-3\n• Magnesium (improves sleep)\n\n❌ Skip fancy pre-workouts with 30 ingredients.";
  return "Great fitness question! The key principles that apply to almost everything:\n\n1️⃣ Consistency beats perfection\n2️⃣ Progressive overload — always do a little more than last time\n3️⃣ Prioritise sleep and recovery\n4️⃣ Nutrition matters more than most think\n\nCould you share a bit more detail? I can give much more specific advice 💪";
}

// ─── Shared UI components ─────────────────────────────────────────────────────
export function AIAvatar({ size = "md" }) {
  const sizes = { sm: "w-7 h-7", md: "w-10 h-10", lg: "w-14 h-14" };
  const icon  = { sm: 13, md: 16, lg: 22 };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-primary/30`}>
      <Sparkles size={icon[size]} className="text-foreground" />
    </div>
  );
}

export function MessageBubble({ msg }) {
  const isUser = msg.from === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && <AIAvatar size="sm" />}
      <div className={`max-w-[80%] space-y-1 flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-overlay/10 border border-border/5 text-foreground rounded-bl-sm"
        }`}>
          {msg.text}
        </div>
        {msg.time && <span className="text-[10px] text-muted px-1">{msg.time}</span>}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <AIAvatar size="sm" />
      <div className="bg-overlay/10 border border-border/5 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-muted"
              style={{ animation: "typingBounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
