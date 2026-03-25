import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import {
  Search,
  Plus,
  Minus,
  X,
  Check,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Clock,
  BookOpen,
  Sparkles,
  ShoppingBasket,
} from "lucide-react";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const FALLBACK_IMG = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=120&q=80";

function normalizeFood(f) {
  return {
    id: f.id,
    name: f.name,
    kcal: f.kcal_per_portion ?? f.kcal ?? 0,
    per: f.portion_label || f.per || "portion",
    protein: f.protein_g ?? f.protein ?? 0,
    carbs: f.carbs_g ?? f.carbs ?? 0,
    fat: f.fat_g ?? f.fat ?? 0,
    category: f.category || "Other",
    img: f.img_url || f.img || FALLBACK_IMG,
  };
}

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Drink", "Supplement"];

const mealTypeConfig = {
  Breakfast:  { color: "#f97316", bg: "bg-primary/15", text: "text-primary", border: "border-primary/30"  },
  Lunch:      { color: "#3b82f6", bg: "bg-blue-500/15",   text: "text-blue-400",   border: "border-blue-500/30"    },
  Dinner:     { color: "#22c55e", bg: "bg-green-500/15",  text: "text-green-400",  border: "border-green-500/30"   },
  Snack:      { color: "#a855f7", bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30"  },
  Drink:      { color: "#06b6d4", bg: "bg-cyan-500/15",   text: "text-cyan-400",   border: "border-cyan-500/30"    },
  Supplement: { color: "#eab308", bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30"  },
};

const categoryColors = {
  Protein: "#f97316",
  Carbs:   "#3b82f6",
  Fats:    "#eab308",
  Veggies: "#22c55e",
  Dairy:   "#06b6d4",
};

// ─── Custom Meal Modal ─────────────────────────────────────────────────────────
const foodCategories = [
  { label: "Protein", color: "#f97316", bg: "bg-primary/15",     text: "text-primary",     border: "border-primary/30"    },
  { label: "Carbs",   color: "#3b82f6", bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/30"   },
  { label: "Fats",    color: "#eab308", bg: "bg-yellow-500/15",  text: "text-yellow-400",  border: "border-yellow-500/30" },
  { label: "Veggies", color: "#22c55e", bg: "bg-green-500/15",   text: "text-green-400",   border: "border-green-500/30"  },
  { label: "Dairy",   color: "#06b6d4", bg: "bg-cyan-500/15",    text: "text-cyan-400",    border: "border-cyan-500/30"   },
];

function CustomMealModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: "", calories: "", protein: "", carbs: "", fat: "",
    category: "Protein", fibre: "", sugar: "", sodium: "",
  });
  const [showExtra, setShowExtra] = useState(false);
  const [saveToLib, setSaveToLib] = useState(true);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl w-full max-w-md shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/10">
          <div>
            <h3 className="text-base font-black text-foreground">Add Custom Meal</h3>
            <p className="text-xs text-muted mt-0.5">Log food not in our database</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-overlay/10 flex items-center justify-center hover:bg-overlay/20 transition-colors">
            <X size={15} className="text-muted" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Meal name */}
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Food / Meal Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Jollof Rice with Fried Chicken"
              className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Select Category</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {foodCategories.map(({ label, bg, text, border }) => (
                <button
                  key={label}
                  onClick={() => set("category", label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    form.category === label
                      ? `${bg} ${text} ${border}`
                      : "bg-overlay/5 text-muted border-border/10 hover:bg-overlay/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Calories */}
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Calories (per portion)</label>
            <div className="mt-1.5 relative">
              <input
                type="number"
                value={form.calories}
                onChange={(e) => set("calories", e.target.value)}
                placeholder="0"
                className="w-full bg-overlay/5 border border-border/10 text-foreground placeholder-gray-600 rounded-xl px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">kcal</span>
            </div>
          </div>

          {/* Macros */}
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Macros (optional)</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "protein", label: "Protein", color: "#f97316", icon: Beef     },
                { key: "carbs",   label: "Carbs",   color: "#3b82f6", icon: Wheat    },
                { key: "fat",     label: "Fats",    color: "#eab308", icon: Droplets },
              ].map(({ key, label, color, icon: Icon }) => (
                <div key={key}>
                  <label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color }}>
                    <Icon size={10} /> {label}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder="0"
                      className="w-full bg-overlay/5 border border-border/10 text-foreground placeholder-gray-600 rounded-xl px-3 py-2.5 pr-7 text-sm focus:outline-none focus:ring-2 transition-all"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted">g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra details toggle */}
          <button
            onClick={() => setShowExtra((p) => !p)}
            className="text-xs font-bold text-primary hover:text-primary flex items-center gap-1 transition-colors"
          >
            <Plus size={12} />
            {showExtra ? "Hide" : "Add more details"} (Fibre, Sugar, Sodium...)
          </button>

          {showExtra && (
            <div className="grid grid-cols-3 gap-2">
              {["fibre", "sugar", "sodium"].map((k) => (
                <div key={k}>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">{k}</label>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      value={form[k]}
                      onChange={(e) => set(k, e.target.value)}
                      placeholder="0"
                      className="w-full bg-overlay/5 border border-border/10 text-foreground placeholder-gray-600 rounded-xl px-3 py-2.5 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted">g</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save to library toggle */}
          <div className="flex items-center justify-between bg-overlay/5 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <BookOpen size={16} className="text-primary" />
              <div>
                <p className="text-xs font-bold text-foreground">Save to My Food Library</p>
                <p className="text-[10px] text-muted">Reuse this meal in future logs</p>
              </div>
            </div>
            <button
              onClick={() => setSaveToLib((p) => !p)}
              className={`w-11 h-6 rounded-full transition-colors relative ${saveToLib ? "bg-primary" : "bg-overlay/10"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${saveToLib ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-3 bg-primary hover:bg-primary rounded-2xl text-sm font-bold text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={15} />
            Save Meal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Food Item Row ─────────────────────────────────────────────────────────────
function FoodItem({ food, qty, onAdd, onRemove }) {
  const catColor = categoryColors[food.category] || "#9ca3af";
  const isAdded  = qty > 0;

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isAdded ? "border-primary/30 bg-primary/10" : "border-border/10 bg-overlay/5 hover:bg-overlay/10"}`}>
      <div className="relative shrink-0">
        <img src={food.img} alt={food.name} className="w-14 h-14 rounded-xl object-cover" />
        <span
          className="absolute -top-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full text-foreground"
          style={{ backgroundColor: catColor }}
        >
          {food.category}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{food.name}</p>
        <p className="text-xs text-muted mt-0.5">per {food.per}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Flame size={10} /> {food.kcal} kcal
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <Beef size={9} className="text-primary" /> {food.protein}g
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <Wheat size={9} className="text-blue-400" /> {food.carbs}g
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <Droplets size={9} className="text-yellow-400" /> {food.fat}g
          </span>
        </div>
      </div>

      {isAdded ? (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-full bg-overlay/10 border border-border/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
          >
            <Minus size={13} className="text-muted" />
          </button>
          <span className="w-5 text-center text-sm font-black text-foreground">{qty}</span>
          <button
            onClick={onAdd}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary transition-colors"
          >
            <Plus size={13} className="text-foreground" />
          </button>
        </div>
      ) : (
        <button
          onClick={onAdd}
          className="shrink-0 w-9 h-9 rounded-full bg-primary hover:bg-primary flex items-center justify-center transition-colors shadow-md shadow-primary/30"
        >
          <Plus size={16} className="text-foreground" />
        </button>
      )}
    </div>
  );
}

// ─── Summary Panel ─────────────────────────────────────────────────────────────
function SummaryPanel({ selected, mealType, onSave, onClearAll, isSaving }) {
  const totalKcal  = selected.reduce((a, i) => a + i.food.kcal    * i.qty, 0);
  const totalProt  = selected.reduce((a, i) => a + i.food.protein * i.qty, 0);
  const totalCarbs = selected.reduce((a, i) => a + i.food.carbs   * i.qty, 0);
  const totalFat   = selected.reduce((a, i) => a + i.food.fat     * i.qty, 0);
  const cfg = mealTypeConfig[mealType] || mealTypeConfig.Breakfast;

  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5 space-y-4 sticky top-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black text-foreground">Meal Summary</p>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
          {mealType}
        </span>
      </div>

      {selected.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2">
          <ShoppingBasket size={28} className="text-subtle" />
          <p className="text-xs text-muted text-center">No items added yet.<br />Search and add foods above.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selected.map(({ food, qty }) => (
              <div key={food.id} className="flex items-center gap-2">
                <img src={food.img} alt={food.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground/80 truncate">{food.name}</p>
                  <p className="text-[10px] text-muted">×{qty} · {food.kcal * qty} kcal</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-overlay/5" />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-xs text-muted"><Flame size={12} className="text-primary" /> Calories</span>
              <span className="text-sm font-black text-primary">{Math.round(totalKcal)} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-xs text-muted"><Beef size={12} className="text-primary" /> Protein</span>
              <span className="text-xs font-bold text-foreground/80">{totalProt.toFixed(1)}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-xs text-muted"><Wheat size={12} className="text-blue-400" /> Carbs</span>
              <span className="text-xs font-bold text-foreground/80">{totalCarbs.toFixed(1)}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-xs text-muted"><Droplets size={12} className="text-yellow-400" /> Fats</span>
              <span className="text-xs font-bold text-foreground/80">{totalFat.toFixed(1)}g</span>
            </div>
          </div>
        </>
      )}

      <div className="space-y-2 pt-1">
        <button
          onClick={onSave}
          disabled={selected.length === 0 || isSaving}
          className="w-full py-3 bg-primary hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed text-foreground font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-foreground/40 border-t-foreground rounded-full animate-spin" />
          ) : (
            <Check size={15} />
          )}
          {isSaving ? "Saving..." : "Save Meal"}
        </button>
        {selected.length > 0 && (
          <button
            onClick={onClearAll}
            className="w-full py-2.5 border border-border/10 hover:bg-overlay/5 text-muted font-semibold rounded-2xl transition-colors text-xs"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function LogMeal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch]         = useState("");
  const [mealType, setMealType]     = useState("Breakfast");
  const [selected, setSelected]     = useState([]);
  const [showCustom, setShowCustom] = useState(false);

  // ── Fetch foods from API ──
  const { data: rawFoods = [], isLoading: foodsLoading } = useQuery({
    queryKey: ["foods", search],
    queryFn: () =>
      api.get(`/foods${search ? `?search=${encodeURIComponent(search)}` : ""}`).then((r) => r.data),
    staleTime: 60_000,
  });

  const foods = rawFoods.map(normalizeFood);

  // ── Log meal mutation ──
  const saveMealMutation = useMutation({
    mutationFn: (payload) => api.post("/meals/log", payload),
    onSuccess: () => {
      toast.success("Meal Logged", `${mealType} added to your nutrition diary.`);
      setSelected([]);
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
    onError: (err) => {
      toast.error("Error", err.response?.data?.message || "Failed to log meal.");
    },
  });

  // ── Create custom food mutation ──
  const createFoodMutation = useMutation({
    mutationFn: (payload) => api.post("/foods", payload),
    onSuccess: (res) => {
      addFood(normalizeFood(res.data));
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
    onError: (err) => {
      toast.error("Error", err.response?.data?.message || "Failed to save food.");
    },
  });

  const getQty = (id) => selected.find((s) => s.food.id === id)?.qty || 0;

  const addFood = (food) => {
    setSelected((prev) => {
      const existing = prev.find((s) => s.food.id === food.id);
      if (existing) return prev.map((s) => s.food.id === food.id ? { ...s, qty: s.qty + 1 } : s);
      return [...prev, { food, qty: 1 }];
    });
  };

  const removeFood = (food) => {
    setSelected((prev) => {
      const existing = prev.find((s) => s.food.id === food.id);
      if (existing?.qty === 1) return prev.filter((s) => s.food.id !== food.id);
      return prev.map((s) => s.food.id === food.id ? { ...s, qty: s.qty - 1 } : s);
    });
  };

  const handleSave = () => {
    saveMealMutation.mutate({
      meal_type: mealType,
      date: new Date().toISOString().slice(0, 10),
      items: selected.map(({ food, qty }) => ({ food_id: food.id, quantity: qty })),
    });
  };

  const handleCustomSave = (form) => {
    createFoodMutation.mutate({
      name: form.name || "Custom Meal",
      kcal_per_portion: Number(form.calories) || 0,
      portion_label: "portion",
      protein_g: Number(form.protein) || 0,
      carbs_g: Number(form.carbs) || 0,
      fat_g: Number(form.fat) || 0,
      fibre_g: Number(form.fibre) || 0,
      sugar_g: Number(form.sugar) || 0,
      sodium_mg: Number(form.sodium) || 0,
      category: form.category,
    });
  };

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-5">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-foreground">Log Meal</h1>
            <p className="text-sm text-muted mt-0.5">Search and add foods to your daily log</p>
          </div>
          <button className="flex items-center gap-2 bg-primary/15 hover:bg-primary/25 text-primary text-sm font-bold px-4 py-2 rounded-xl transition-colors border border-primary/30">
            <Sparkles size={14} />
            AI Suggest
          </button>
        </div>

        {/* Meal type selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mealTypes.map((t) => {
            const cfg = mealTypeConfig[t];
            return (
              <button
                key={t}
                onClick={() => setMealType(t)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${
                  mealType === t
                    ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                    : "bg-overlay/5 text-muted border-border/10 hover:bg-overlay/10"
                }`}
              >
                <Clock size={13} />
                {t}
              </button>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Left — search + food list */}
          <div className="md:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search food items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-overlay/5 border border-border/10 text-foreground placeholder-gray-600 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground/80">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Food list */}
            <div className="space-y-3">
              {foodsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                foods.map((food) => (
                  <FoodItem
                    key={food.id}
                    food={food}
                    qty={getQty(food.id)}
                    onAdd={() => addFood(food)}
                    onRemove={() => removeFood(food)}
                  />
                ))
              )}

              {!foodsLoading && foods.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Search size={28} className="text-subtle" />
                  <p className="text-sm text-muted font-semibold">No foods found for "{search}"</p>
                  <button
                    onClick={() => setShowCustom(true)}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Add it as a custom meal →
                  </button>
                </div>
              )}
            </div>

            {/* Add custom meal */}
            <button
              onClick={() => setShowCustom(true)}
              className="w-full py-4 border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 rounded-2xl text-sm font-bold text-primary hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Custom Meal
            </button>
          </div>

          {/* Right — summary */}
          <div>
            <SummaryPanel
              selected={selected}
              mealType={mealType}
              onSave={handleSave}
              onClearAll={() => setSelected([])}
              isSaving={saveMealMutation.isPending}
            />
          </div>
        </div>
      </div>

      {/* Custom meal modal */}
      {showCustom && (
        <CustomMealModal
          onSave={handleCustomSave}
          onClose={() => setShowCustom(false)}
        />
      )}
    </div>
  );
}
