import { useState, useRef, useEffect } from "react";
import {
  Dumbbell, Salad, Activity, Target, Flame, Clock,
  Send, Search, Plus, X, MessageCircle, Users,
  Phone, MoreVertical, ChevronLeft,
  Trash2, BellOff, UserX, Flag, UserCircle,
} from "lucide-react";

import { useIsMobile } from "../../hooks/use-mobile";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const clients = [
  {
    id: 1, name: "Emmanuel Acquah", initials: "EA", color: "#f97316",
    goal: "Weight Loss", plan: "Pro", progress: 30,
    weight: 82, targetWeight: 75, height: 175, age: 23,
    workoutPlan: "Strength 4x/week", dietPlan: "High Protein",
    lastActive: "Today", streak: 7,
    weightData: [
      { day: "Mon", w: 86 }, { day: "Tue", w: 84 }, { day: "Wed", w: 83 },
      { day: "Thu", w: 82.5 }, { day: "Fri", w: 83 }, { day: "Sat", w: 82 }, { day: "Sun", w: 81 },
    ],
    messages: [
      { id: 1, from: "client", text: "Morning Coach! Feeling sore after squats.", time: "9:01 AM" },
      { id: 2, from: "trainer", text: "That's normal! Rest up and hydrate 💧", time: "9:03 AM" },
      { id: 3, from: "client", text: "Will do! What's on for Friday?", time: "9:05 AM" },
    ],
  },
  {
    id: 2, name: "Akua Mensah", initials: "AM", color: "#3b82f6",
    goal: "Muscle Gain", plan: "Free", progress: 65,
    weight: 60, targetWeight: 68, height: 162, age: 26,
    workoutPlan: "Upper/Lower Split", dietPlan: "High Calorie",
    lastActive: "Yesterday", streak: 3,
    weightData: [
      { day: "Mon", w: 59 }, { day: "Tue", w: 59.5 }, { day: "Wed", w: 60 },
      { day: "Thu", w: 60 }, { day: "Fri", w: 60.5 }, { day: "Sat", w: 60 }, { day: "Sun", w: 60 },
    ],
    messages: [
      { id: 1, from: "trainer", text: "Great session Akua! How's nutrition?", time: "8:00 AM" },
      { id: 2, from: "client", text: "Struggling to hit 2500 calories.", time: "8:30 AM" },
    ],
  },
  {
    id: 3, name: "Kwame Boateng", initials: "KB", color: "#ef4444",
    goal: "Muscle Gain", plan: "Pro", progress: 80,
    weight: 75, targetWeight: 85, height: 180, age: 28,
    workoutPlan: "PPL 6x/week", dietPlan: "Bulking",
    lastActive: "2 days ago", streak: 12,
    weightData: [
      { day: "Mon", w: 74 }, { day: "Tue", w: 74.5 }, { day: "Wed", w: 75 },
      { day: "Thu", w: 75 }, { day: "Fri", w: 75.5 }, { day: "Sat", w: 75 }, { day: "Sun", w: 75 },
    ],
    messages: [
      { id: 1, from: "client", text: "Hit a new PR! 100kg bench press!", time: "Yesterday" },
      { id: 2, from: "trainer", text: "LETS GO Kwame!! 🔥🔥", time: "Yesterday" },
    ],
  },
  {
    id: 4, name: "Ama Darko", initials: "AD", color: "#22c55e",
    goal: "Weight Loss", plan: "Free", progress: 40,
    weight: 78, targetWeight: 65, height: 165, age: 31,
    workoutPlan: "Cardio + HIIT", dietPlan: "Low Carb",
    lastActive: "3 days ago", streak: 1,
    weightData: [
      { day: "Mon", w: 79 }, { day: "Tue", w: 78.5 }, { day: "Wed", w: 78.5 },
      { day: "Thu", w: 78 }, { day: "Fri", w: 78 }, { day: "Sat", w: 78 }, { day: "Sun", w: 78 },
    ],
    messages: [
      { id: 1, from: "trainer", text: "Hi Ama! Haven't seen you in 3 days. Everything okay?", time: "2h ago" },
    ],
  },
];

const workoutTemplates = [
  { id: "w1", name: "Strength 4x/week",  desc: "Full body compound movements" },
  { id: "w2", name: "PPL 6x/week",       desc: "Push, Pull, Legs split" },
  { id: "w3", name: "Upper/Lower Split", desc: "4 days alternating" },
  { id: "w4", name: "Cardio + HIIT",     desc: "Fat burning cardio focus" },
];
const dietTemplates = [
  { id: "d1", name: "High Protein",  desc: "2g protein per kg bodyweight" },
  { id: "d2", name: "High Calorie",  desc: "500 kcal surplus for bulk" },
  { id: "d3", name: "Low Carb",      desc: "Under 100g carbs/day" },
  { id: "d4", name: "Bulking",       desc: "Clean bulk with macros tracked" },
];

function GoalBadge({ goal }) {
  const colors = {
    "Weight Loss": "bg-red-500/15 text-red-400 border border-red-500/20",
    "Muscle Gain": "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    "Maintain":    "bg-green-500/15 text-green-400 border border-green-500/20",
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${colors[goal] || "bg-overlay/10 text-muted border border-border/10"}`}>
      {goal}
    </span>
  );
}

function PlanBadge({ plan }) {
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${plan === "Pro" ? "bg-primary/15 text-primary border border-primary/20" : "bg-overlay/10 text-muted border border-border/10"}`}>
      {plan}
    </span>
  );
}

function AssignPlanModal({ client, onClose }) {
  const [planType, setPlanType] = useState("workout");
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  const templates = planType === "workout" ? workoutTemplates : dietTemplates;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-foreground">Assign Plan</h3>
            <p className="text-xs text-muted mt-0.5">For {client.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-overlay/10 flex items-center justify-center hover:bg-overlay/15 transition-colors">
            <X size={15} className="text-muted" />
          </button>
        </div>

        {/* Plan type toggle */}
        <div className="flex bg-overlay/10 rounded-xl p-1 gap-1">
          {["workout", "diet"].map((type) => (
            <button key={type} onClick={() => { setPlanType(type); setSelected(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all capitalize ${planType === type ? "bg-overlay/5 text-primary shadow-sm" : "text-muted hover:text-foreground/80"}`}>
              {type === "workout" ? <Dumbbell size={13} /> : <Salad size={13} />}
              {type === "workout" ? "Workout" : "Diet"}
            </button>
          ))}
        </div>

        {/* Templates */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted uppercase tracking-wider">Choose Template</p>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((t) => (
              <button key={t.id} onClick={() => setSelected(t.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${selected === t.id ? "border-primary/50 bg-primary/10" : "bg-overlay/5 border-border/10 hover:border-border/20"}`}>
                <p className={`text-xs font-bold ${selected === t.id ? "text-primary" : "text-foreground"}`}>{t.name}</p>
                <p className="text-[10px] text-muted mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider">Note (optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for your client..."
            rows={3}
            className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all resize-none" />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors">
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={onClose}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold text-foreground transition-colors ${selected ? "bg-primary hover:bg-primary" : "bg-primary/30 cursor-not-allowed"}`}>
            Assign Plan
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ client, onAssign, onMessage }) {
  const minW = Math.min(...client.weightData.map((d) => d.w)) - 1;
  const maxW = Math.max(...client.weightData.map((d) => d.w)) + 1;

  return (
    <div className="overflow-y-auto flex-1 p-6 space-y-5">
      {/* Hero */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-foreground text-xl shrink-0"
            style={{ backgroundColor: client.color }}>
            {client.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-foreground">{client.name}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <PlanBadge plan={client.plan} />
              <GoalBadge goal={client.goal} />
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Clock size={12} /> {client.lastActive}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-primary font-bold">
                <Flame size={12} /> {client.streak} day streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Age", value: `${client.age} yrs` },
          { label: "Height", value: `${client.height} cm` },
          { label: "Current Weight", value: `${client.weight} kg` },
          { label: "Target Weight", value: `${client.targetWeight} kg` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-overlay/5 border border-border/10 rounded-2xl p-3">
            <p className="text-xs text-muted">{label}</p>
            <p className="text-base font-black text-foreground mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Goal Progress */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={15} className="text-primary" />
            <p className="text-sm font-bold text-foreground">Goal Progress</p>
          </div>
          <span className="text-sm font-black text-primary">{client.progress}%</span>
        </div>
        <div className="h-2.5 bg-overlay/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-700 rounded-full transition-all duration-700"
            style={{ width: `${client.progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted">
          <span>Start: {client.goal === "Weight Loss" ? client.weightData[0]?.w : client.weightData[0]?.w} kg</span>
          <span>Target: {client.targetWeight} kg</span>
        </div>
      </div>

      {/* Weight Trend */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-primary" />
          <p className="text-sm font-bold text-foreground">Weight Trend — This Week</p>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={client.weightData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[minW, maxW]} tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#1d1a17", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
              formatter={(v) => [`${v} kg`, "Weight"]}
            />
            <Area type="monotone" dataKey="w" stroke="#f97316" strokeWidth={2} fill="url(#weightGrad)" dot={{ fill: "#f97316", r: 3 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Current Plans */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-bold text-foreground">Current Plans</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <Dumbbell size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted">Workout Plan</p>
                <p className="text-sm font-bold text-foreground">{client.workoutPlan}</p>
              </div>
            </div>
            <button onClick={onAssign} className="text-[10px] font-bold bg-primary/15 text-primary border border-primary/20 px-2.5 py-1 rounded-lg hover:bg-primary/25 transition-colors">
              Update
            </button>
          </div>
          <div className="h-px bg-overlay/5" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
                <Salad size={14} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted">Diet Plan</p>
                <p className="text-sm font-bold text-foreground">{client.dietPlan}</p>
              </div>
            </div>
            <button onClick={onAssign} className="text-[10px] font-bold bg-primary/15 text-primary border border-primary/20 px-2.5 py-1 rounded-lg hover:bg-primary/25 transition-colors">
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pb-2">
        <button onClick={onAssign} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary text-foreground text-sm font-bold rounded-2xl transition-colors">
          <Plus size={15} /> Assign Plan
        </button>
        <button onClick={onMessage} className="flex-1 flex items-center justify-center gap-2 py-3 border border-border/10 hover:bg-overlay/5 text-foreground/80 text-sm font-bold rounded-2xl transition-colors">
          <MessageCircle size={15} /> Send Message
        </button>
      </div>
    </div>
  );
}

function MessagesTab({ client, onBack }) {
  const [messages, setMessages] = useState(client.messages);
  const [input, setInput]       = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const bottomRef = useRef(null);
  const menuRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => { setMessages(client.messages); }, [client.id]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((p) => [...p, { id: Date.now(), from: "trainer", text: trimmed, time: "Now" }]);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const menuItems = [
    { icon: UserCircle, label: "View Profile",       action: () => {} },
    { icon: BellOff,    label: "Mute Notifications", action: () => {} },
    { icon: Trash2,     label: "Clear Chat",         action: () => {}, danger: false },
    { icon: Flag,       label: "Report",             action: () => {}, danger: false },
    { icon: UserX,      label: "Remove Client",      action: () => {}, danger: true  },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Chat header */}
      <div className="bg-elevated border-b border-border/10 px-4 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-full hover:bg-overlay/10 flex items-center justify-center transition-colors shrink-0"
            >
              <ChevronLeft size={18} className="text-muted" />
            </button>
          )}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-black text-foreground text-xs shrink-0"
            style={{ backgroundColor: client.color }}
          >
            {client.initials}
          </div>
          <div>
            <p className="text-sm font-black text-foreground">{client.name}</p>
            <p className="text-xs text-muted">{client.lastActive}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full hover:bg-overlay/10 flex items-center justify-center transition-colors">
            <Phone size={16} className="text-muted" />
          </button>

          {/* Three-dot dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((p) => !p)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                showMenu ? "bg-overlay/10" : "hover:bg-overlay/10"
              }`}
            >
              <MoreVertical size={16} className="text-muted" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-elevated border border-border/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                {menuItems.map(({ icon: Icon, label, action, danger }) => (
                  <button
                    key={label}
                    onClick={() => { action(); setShowMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-overlay/5 ${
                      danger ? "text-red-400" : "text-foreground/80"
                    }`}
                  >
                    <Icon size={15} className={danger ? "text-red-400" : "text-muted"} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === "trainer" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-xs space-y-1">
              <div className={`px-4 py-2.5 ${msg.from === "trainer"
                ? "bg-primary text-foreground rounded-2xl rounded-br-sm"
                : "bg-overlay/10 text-foreground rounded-2xl rounded-bl-sm"}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              <p className={`text-[10px] text-muted ${msg.from === "trainer" ? "text-right" : "text-left"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-border/10 p-4 shrink-0">
        <div className="flex items-center gap-3 bg-overlay/5 border border-border/10 rounded-2xl px-4 py-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${client.name.split(" ")[0]}...`}
            className="flex-1 bg-transparent text-foreground placeholder:text-subtle text-sm focus:outline-none"
          />
          <button onClick={send}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${input.trim() ? "bg-primary hover:bg-primary text-foreground" : "bg-overlay/5 text-subtle"}`}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TrainerDashboard() {
  const isMobile = useIsMobile();

  const [selectedId, setSelectedId]   = useState(null);
  const [search, setSearch]           = useState("");
  const [listFilter, setListFilter]   = useState("All");
  const [activeTab, setActiveTab]     = useState("overview");
  const [showAssign, setShowAssign]   = useState(false);

  const selectedClient = clients.find((c) => c.id === selectedId);

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = listFilter === "All" ? true
      : listFilter === "Active" ? ["Today", "Yesterday"].includes(c.lastActive)
      : !["Today", "Yesterday"].includes(c.lastActive);
    return matchSearch && matchFilter;
  });

  const handleSelectClient = (id) => {
    setSelectedId(id);
    setActiveTab("overview");
  };

  const handleBack = () => {
    setSelectedId(null);
    setActiveTab("overview");
  };

  /* ── Sidebar ─────────────────────────────────────────────────────────── */
  const Sidebar = (
    <aside className={`${isMobile ? "w-full" : "w-80 shrink-0"} bg-elevated border-r border-border/10 flex flex-col overflow-hidden`}>
      <div className="p-4 border-b border-border/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shrink-0">
            <span className="text-foreground font-black text-sm">CA</span>
          </div>
          <div>
            <p className="text-sm font-black text-foreground">Coach Amara</p>
            <p className="text-xs text-muted">{clients.length} clients</p>
          </div>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-8 pr-3 py-2 bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex gap-1 bg-overlay/5 rounded-xl p-1">
          {["All", "Active", "Inactive"].map((f) => (
            <button key={f} onClick={() => setListFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${listFilter === f ? "bg-primary text-foreground" : "text-muted hover:text-foreground/80"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-10 gap-2">
            <Users size={22} className="text-subtle" />
            <p className="text-xs text-muted">No clients found</p>
          </div>
        )}
        {filtered.map((c) => {
          const isSelected = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectClient(c.id)}
              className={`w-full px-4 py-3 flex items-center gap-3 cursor-pointer border-l-2 transition-all text-left ${isSelected ? "border-primary bg-primary/5" : "border-transparent hover:bg-overlay/5"}`}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-foreground text-xs shrink-0"
                style={{ backgroundColor: c.color }}>
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-foreground truncate">{c.name}</p>
                  <span className="flex items-center gap-0.5 text-[10px] text-primary font-bold shrink-0">
                    <Flame size={10} />{c.streak}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <GoalBadge goal={c.goal} />
                </div>
                <p className="text-[10px] text-muted mt-1">{c.lastActive}</p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );

  /* ── Right panel ─────────────────────────────────────────────────────── */
  const RightPanel = selectedClient ? (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Tab bar */}
      <div className="border-b border-border/10 px-6 flex items-center gap-6 shrink-0 bg-surface">
        {[
          { id: "overview",  label: "Overview"  },
          { id: "messages",  label: "Messages"  },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`py-4 text-sm font-bold border-b-2 transition-all -mb-px ${activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground/80"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === "overview" && (
          <OverviewTab
            client={selectedClient}
            onAssign={() => setShowAssign(true)}
            onMessage={() => setActiveTab("messages")}
          />
        )}
        {activeTab === "messages" && (
          <MessagesTab
            client={selectedClient}
            onBack={isMobile ? handleBack : undefined}
          />
        )}
      </div>
    </div>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <Users size={32} className="text-subtle" />
      <p className="text-sm text-muted">Select a client to get started</p>
    </div>
  );

  return (
    <div className="bg-surface flex overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>

      {/* Mobile: show sidebar or panel, not both */}
      {isMobile ? (
        selectedClient ? RightPanel : Sidebar
      ) : (
        <>
          {Sidebar}
          {RightPanel}
        </>
      )}

      {showAssign && selectedClient && (
        <AssignPlanModal client={selectedClient} onClose={() => setShowAssign(false)} />
      )}
    </div>
  );
}
