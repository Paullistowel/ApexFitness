import { useState, useRef, useEffect } from "react";
import {
  Send, Sparkles, Dumbbell, Salad,
  Flame, Zap, HelpCircle, RotateCcw, ChevronDown,
} from "lucide-react";

// ─── Constants ─────────────────────────────────────────────────────────────────
const AI_NAME     = "Apex AI Coach";
const AI_SUBTITLE = "Your personal fitness assistant · Always available";

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: "ai",
    text: "Hey Emmanuel! 👋 I'm your Apex AI Coach — your personal fitness assistant powered by AI.\n\nI can help you with workout plans, nutrition advice, exercise form, recovery tips, and anything fitness-related.\n\nWhat would you like to work on today?",
    time: "",
  },
];

const SUGGESTED_PROMPTS = [
  { icon: Dumbbell,    label: "Create a workout plan for me"       },
  { icon: Salad,       label: "What should I eat to lose weight?"  },
  { icon: Zap,         label: "Best exercises for beginners"       },
  { icon: HelpCircle,  label: "How much protein do I need?"        },
  { icon: Flame,       label: "Cardio or weights for fat loss?"    },
  { icon: Dumbbell,    label: "Help me build muscle fast"          },
];

// ─── AI response engine ────────────────────────────────────────────────────────
function getAIResponse(text) {
  const q = text.toLowerCase();

  if (q.includes("workout plan") || q.includes("training plan")) {
    return "Here's a balanced 4-day plan based on your goals:\n\n💪 Day 1 — Push (Chest · Shoulders · Triceps)\n• Bench Press 4×8\n• Shoulder Press 3×10\n• Tricep Dips 3×12\n\n🔁 Day 2 — Pull (Back · Biceps)\n• Pull-ups 4×8\n• Barbell Row 3×10\n• Bicep Curls 3×12\n\n🦵 Day 3 — Legs\n• Squats 4×8\n• Romanian Deadlift 3×10\n• Walking Lunges 3×12 each\n\n🔥 Day 4 — HIIT Cardio (30 min)\n\nRest on remaining days. Want me to adjust this for a specific goal like fat loss or muscle gain?";
  }
  if (q.includes("lose weight") || q.includes("weight loss") || q.includes("fat loss")) {
    return "Fat loss comes down to a few key things:\n\n🍽️ Nutrition (80% of the battle)\n• Eat in a calorie deficit (300–500 kcal below maintenance)\n• Prioritise protein — aim for 1.6–2g per kg of bodyweight\n• Cut liquid calories (soda, alcohol, sugary coffee)\n\n🏃 Exercise\n• 3–4 strength sessions per week builds muscle while burning fat\n• Add 2–3 low-intensity cardio sessions (walks, cycling)\n\n😴 Recovery\n• Sleep 7–9 hours — poor sleep spikes hunger hormones\n• Manage stress to keep cortisol low\n\nWhat's your current diet like? I can give more specific advice.";
  }
  if (q.includes("build muscle") || q.includes("muscle gain") || q.includes("bulk")) {
    return "To build muscle effectively:\n\n📈 Key principles:\n• Progressive overload — add weight or reps each week\n• Caloric surplus — eat 200–300 kcal above maintenance\n• High protein intake — 2g per kg of bodyweight daily\n\n🏋️ Best exercises for growth:\n• Compound lifts: Squat, Deadlift, Bench Press, Rows\n• Train each muscle group 2× per week\n• 3–4 sets of 6–12 reps per exercise\n\n🛌 Recovery is where muscle is BUILT:\n• Sleep 8 hours minimum\n• Allow 48hrs rest per muscle group\n\nConsistency over 3–6 months is what moves the needle. What's your current training frequency?";
  }
  if (q.includes("protein") || q.includes("how much protein")) {
    return "Great question! Here's what the research says:\n\n🥩 Protein targets:\n• General health: 0.8g per kg bodyweight\n• Active / gym-goer: 1.6–2g per kg bodyweight\n• Cutting (fat loss): up to 2.4g per kg to preserve muscle\n\n📊 Example for 80kg person:\n• Minimum: 64g/day\n• Optimal for muscle: 128–160g/day\n\n🍗 Best protein sources:\n• Chicken breast, eggs, Greek yogurt\n• Tuna, salmon, beef\n• Whey protein (convenient post-workout)\n• Tofu, lentils, chickpeas (plant-based)\n\nSpread your intake across 3–4 meals for best absorption. Need a sample meal plan?";
  }
  if (q.includes("beginner") || q.includes("start") || q.includes("new to gym")) {
    return "Welcome to your fitness journey! Here's a beginner-friendly approach:\n\n📅 Start with 3 days/week (e.g. Mon · Wed · Fri)\n\n🔰 Full Body Beginner Routine:\n• Goblet Squat 3×12\n• Push-ups 3×10 (or incline if needed)\n• Dumbbell Row 3×10 each side\n• Hip Hinge (Romanian Deadlift) 3×12\n• Plank 3×30 seconds\n\n📝 Beginner tips:\n• Focus on form before adding weight\n• Rest 60–90 seconds between sets\n• Track your workouts so you can progress\n• Don't skip warm-up — 5 mins light cardio\n\nYou'll see results within 4–6 weeks if you stay consistent. What equipment do you have access to?";
  }
  if (q.includes("cardio") || q.includes("running") || q.includes("hiit")) {
    return "Cardio vs. weights — the answer depends on your goal:\n\n⚡ HIIT (High Intensity Interval Training)\n• Burns more calories in less time\n• Boosts metabolism for hours after (afterburn effect)\n• Great for fat loss and conditioning\n• 20–30 min sessions, 2–3× per week\n\n🚶 Steady-State Cardio\n• Great for heart health and active recovery\n• Lower injury risk, sustainable long-term\n• 30–45 min walks, cycling or swimming\n\n🏋️ Weights\n• Builds muscle which raises your resting metabolism\n• Best for body recomposition (losing fat + gaining muscle)\n\n💡 Best combo: 3–4 strength sessions + 2 cardio sessions per week.\n\nWhat's your main goal — fat loss, endurance or general fitness?";
  }
  if (q.includes("diet") || q.includes("eat") || q.includes("food") || q.includes("meal")) {
    return "Here are my top evidence-based nutrition principles:\n\n✅ Do this:\n• Eat mostly whole foods (lean meats, vegetables, whole grains)\n• Hit your protein target every day\n• Stay hydrated — at least 2.5L of water daily\n• Eat at consistent times to regulate hunger\n\n❌ Minimise:\n• Ultra-processed foods and fast food\n• Sugary drinks and alcohol\n• Mindless snacking late at night\n\n🍽️ A simple plate formula:\n• ½ plate — vegetables\n• ¼ plate — lean protein\n• ¼ plate — complex carbs (rice, oats, sweet potato)\n\nWant me to build a full day meal plan tailored to your goals?";
  }
  if (q.includes("sore") || q.includes("pain") || q.includes("recovery")) {
    return "Soreness is a normal part of training — here's how to recover faster:\n\n🛌 Sleep (most important)\n• 7–9 hours is non-negotiable for muscle repair\n• Growth hormone peaks during deep sleep\n\n🥩 Nutrition\n• Eat enough protein to rebuild damaged muscle fibres\n• Don't skip carbs on training days — they replenish glycogen\n\n💧 Hydration\n• Even mild dehydration slows recovery significantly\n• Aim for 2.5–3L water per day\n\n🧘 Active recovery\n• Light walking, stretching or yoga on rest days\n• Reduces stiffness and promotes blood flow to muscles\n\n🧊 Bonus: contrast showers (hot then cold) reduce inflammation\n\nIf the pain is sharp or localised to a joint rather than muscle, rest it and consider seeing a physio.";
  }
  if (q.includes("sleep") || q.includes("rest")) {
    return "Sleep is the most underrated performance enhancer — here's why it matters:\n\n🧠 What happens while you sleep:\n• Human Growth Hormone (HGH) is released — this builds muscle\n• Muscle tissue is repaired and strengthened\n• Energy stores (glycogen) are replenished\n• Cortisol (stress hormone) is reduced\n\n😴 Sleep recommendations:\n• 7–9 hours for most adults\n• Athletes may benefit from up to 10 hours\n• Consistency matters — same bedtime and wake time\n\n📱 Tips to improve sleep quality:\n• No screens 1hr before bed\n• Keep your room cool and dark\n• Avoid caffeine after 2pm\n• Magnesium glycinate supplement can help\n\nAre you struggling with sleep? I can help you build a better bedtime routine.";
  }
  if (q.includes("water") || q.includes("hydrat")) {
    return "Hydration is critical for performance and recovery:\n\n💧 How much water to drink:\n• General: 35ml per kg of bodyweight\n• Active: Add 500–750ml per hour of exercise\n• Hot climates: Add another 500ml\n\n📊 Example for 80kg person:\n• Base: 2.8L per day\n• On training days: 3.3–3.5L\n\n⚠️ Signs of dehydration:\n• Dark yellow urine\n• Headaches during or after workouts\n• Decreased strength and endurance\n• Brain fog and fatigue\n\n💡 Tips:\n• Start every morning with 500ml water\n• Carry a water bottle everywhere\n• Add electrolytes if sweating heavily\n\nYou can track your water intake in the Water Tracker section of the app!";
  }
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return "Hey there! 👋 Great to see you. I'm here and ready to help you crush your fitness goals.\n\nYou can ask me about:\n• 🏋️ Workout plans and exercises\n• 🥗 Nutrition and meal planning\n• 💊 Supplements and recovery\n• 📈 Progress and goal setting\n\nWhat's on your mind today?";
  }
  if (q.includes("supplement") || q.includes("creatine") || q.includes("whey")) {
    return "Here are the only supplements with strong scientific backing:\n\n🥇 Tier 1 — Highly effective:\n• Creatine Monohydrate — increases strength and power output by 5–10%. Take 3–5g daily\n• Whey Protein — convenient way to hit protein targets. 1 scoop post-workout\n• Caffeine — improves performance and focus. 200–400mg pre-workout\n\n🥈 Tier 2 — Useful in some cases:\n• Vitamin D — most people are deficient, supports testosterone and immunity\n• Omega-3 (Fish Oil) — reduces inflammation and improves joint health\n• Magnesium — improves sleep quality and muscle function\n\n❌ Skip the fancy pre-workouts with 30 ingredients — most of it is placebo.\n\nWhat are your goals? I can recommend what's actually worth your money.";
  }

  return "That's a great fitness question! Based on what you're asking, here's my advice:\n\nThe key principles that apply to almost everything in fitness are:\n\n1️⃣ Consistency beats perfection — show up even on bad days\n2️⃣ Progressive overload — always aim to do a little more than last time\n3️⃣ Prioritise sleep and recovery — this is when you actually improve\n4️⃣ Nutrition matters more than most people think\n\nCould you give me a bit more detail about what you're trying to achieve? I can give you much more specific advice that way! 💪";
}

// ─── AI Avatar ─────────────────────────────────────────────────────────────────
function AIAvatar({ size = "md" }) {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" };
  const icon  = { sm: 14, md: 16, lg: 22 };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-primary/30`}>
      <Sparkles size={icon[size]} className="text-foreground" />
    </div>
  );
}

// ─── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.from === "user";
  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && <AIAvatar size="sm" />}
      <div className={`max-w-[80%] sm:max-w-xl space-y-1 flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-overlay/10 border border-border/5 text-foreground rounded-bl-sm"
        }`}>
          {msg.text}
        </div>
        {msg.time && (
          <span className="text-[10px] text-muted px-1">{msg.time}</span>
        )}
      </div>
    </div>
  );
}

// ─── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <AIAvatar size="sm" />
      <div className="bg-overlay/10 border border-border/5 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-muted"
              style={{ animation: "typingBounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ChatWithTrainer() {
  const [messages, setMessages]       = useState(INITIAL_MESSAGES);
  const [input, setInput]             = useState("");
  const [isTyping, setIsTyping]       = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollAreaRef  = useRef(null);
  const inputRef       = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Show/hide scroll-to-bottom button
  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const send = (text = input.trim()) => {
    if (!text || isTyping) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { id: Date.now(), from: "user", text, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay (800ms–1800ms)
    const delay = 800 + Math.random() * 1000;
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        from: "ai",
        text: getAIResponse(text),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setIsTyping(false);
  };

  const showSuggestions = messages.length <= 1 && !isTyping;

  return (
    <div className="flex flex-col bg-surface" style={{ height: "calc(100vh - 56px)" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-elevated border-b border-border/10 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <AIAvatar size="md" />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-foreground">{AI_NAME}</p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">{AI_SUBTITLE}</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-red-400 bg-overlay/5 hover:bg-red-500/10 border border-border/10 hover:border-red-500/20 px-3 py-1.5 rounded-xl transition-all"
        >
          <RotateCcw size={12} />
          New Chat
        </button>
      </div>

      {/* ── Messages area ────────────────────────────────────────────────── */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 relative"
      >
        {/* Max-width container */}
        <div className="max-w-3xl mx-auto space-y-5">

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {isTyping && <TypingIndicator />}

          {/* Suggested prompts — shown only on fresh chat */}
          {showSuggestions && (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-muted font-semibold text-center">Suggested questions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => send(label)}
                    className="flex items-center gap-3 text-left px-4 py-3 bg-overlay/5 hover:bg-overlay/10 border border-border/10 hover:border-primary/30 rounded-2xl transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 w-9 h-9 rounded-full bg-elevated border border-border/10 flex items-center justify-center shadow-lg hover:bg-overlay/10 transition-colors z-10"
          style={{ position: "fixed", bottom: "90px", right: "24px" }}
        >
          <ChevronDown size={16} className="text-muted" />
        </button>
      )}

      {/* ── Input bar ────────────────────────────────────────────────────── */}
      <div className="bg-elevated border-t border-border/10 px-4 sm:px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about fitness, nutrition or workouts…"
                className="w-full resize-none bg-overlay/5 border border-border/10 focus:border-primary/30 text-foreground placeholder-gray-600 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all max-h-36 overflow-y-auto"
                style={{ lineHeight: "1.5" }}
              />
            </div>
            <button
              onClick={() => send()}
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 rounded-full bg-primary hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md shadow-primary/30 shrink-0"
            >
              <Send size={16} className="text-foreground ml-0.5" />
            </button>
          </div>
          <p className="text-[10px] text-subtle text-center mt-2">
            Apex AI Coach can make mistakes. Always consult a professional for medical advice.
          </p>
        </div>
      </div>

      <style>{`@keyframes typingBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
