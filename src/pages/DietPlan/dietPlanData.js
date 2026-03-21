export const DAYS       = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const FULL_DATES = ["Mar 10","Mar 11","Mar 12","Mar 13","Mar 14","Mar 15","Mar 16"];
export const TODAY_IDX  = 2; // Wednesday

function generateMeals(bCal, lCal, sCal, dCal) {
  return [
    {
      id: "breakfast", label: "Breakfast", time: "7:00 – 8:30 AM",
      calories: bCal, color: "#f97316",
      items: [
        { name: "Overnight Oats with Berries & Almonds", kcal: 320, dot: "#f97316" },
        { name: "2 Boiled Eggs",                         kcal: 140, dot: "#fb923c" },
        { name: "Black Coffee (unsweetened)",             kcal: 5,   dot: "#fed7aa" },
      ],
    },
    {
      id: "lunch", label: "Lunch", time: "12:00 – 1:30 PM",
      calories: lCal, color: "#3b82f6",
      items: [
        { name: "Grilled Chicken Breast", kcal: 280, dot: "#3b82f6" },
        { name: "Brown Rice (cooked)",    kcal: 215, dot: "#60a5fa" },
        { name: "Garden Salad",           kcal: 90,  dot: "#93c5fd" },
      ],
    },
    {
      id: "snack", label: "Snack", time: "3:00 – 4:00 PM",
      calories: sCal, color: "#a855f7",
      items: [
        { name: "Greek Yogurt with Honey", kcal: 180, dot: "#a855f7" },
        { name: "Mixed Nuts (30g)",        kcal: 180, dot: "#c084fc" },
        { name: "Apple",                   kcal: 80,  dot: "#e9d5ff" },
      ],
    },
    {
      id: "dinner", label: "Dinner", time: "7:00 – 8:30 PM",
      calories: dCal, color: "#22c55e",
      items: [
        { name: "Salmon Fillet (baked)", kcal: 250, dot: "#22c55e" },
        { name: "Steamed Broccoli",      kcal: 55,  dot: "#4ade80" },
        { name: "Sweet Potato",          kcal: 115, dot: "#86efac" },
      ],
    },
  ];
}

export const weekMeals = {
  0: { goal: 2100, meals: generateMeals(480, 600, 580, 440) },
  1: { goal: 2100, meals: generateMeals(510, 620, 550, 420) },
  2: { goal: 2100, meals: generateMeals(480, 620, 620, 620) },
  3: { goal: 2100, meals: generateMeals(500, 590, 610, 400) },
  4: { goal: 2100, meals: generateMeals(460, 640, 600, 380) },
  5: { goal: 2100, meals: generateMeals(520, 600, 570, 410) },
  6: { goal: 2100, meals: generateMeals(490, 610, 580, 420) },
};

export const macros = {
  protein: { current: 128, goal: 150, color: "#3b82f6", label: "Protein" },
  carbs:   { current: 210, goal: 240, color: "#22c55e", label: "Carbs"   },
  fats:    { current: 58,  goal: 65,  color: "#f97316", label: "Fats"    },
};

// ---------------------------------------------------------------------------
// Meal Alternatives — one pool per meal slot, 6 options each
// ---------------------------------------------------------------------------

export const mealAlternatives = {
  breakfast: [
    {
      id: "b1",
      name: "Peanut Butter Banana Oats",
      calories: 420,
      emoji: "🥣",
      tags: ["High Protein", "High Carb"],
      items: [
        { name: "Rolled Oats (80g)", kcal: 290 },
        { name: "Banana", kcal: 90 },
        { name: "Peanut Butter (1 tbsp)", kcal: 90 },
      ],
    },
    {
      id: "b2",
      name: "Avocado Toast & Poached Eggs",
      calories: 450,
      emoji: "🍳",
      tags: ["Balanced", "High Protein"],
      items: [
        { name: "Whole-Grain Toast (2 slices)", kcal: 180 },
        { name: "Avocado (½)", kcal: 120 },
        { name: "Poached Eggs (2)", kcal: 150 },
      ],
    },
    {
      id: "b3",
      name: "Green Smoothie Bowl",
      calories: 340,
      emoji: "🥗",
      tags: ["Vegan", "Low Cal"],
      items: [
        { name: "Frozen Mango & Spinach Blend", kcal: 180 },
        { name: "Almond Milk (200ml)", kcal: 30 },
        { name: "Granola (30g)", kcal: 120 },
        { name: "Chia Seeds (1 tsp)", kcal: 25 },
      ],
    },
    {
      id: "b4",
      name: "Keto Egg & Bacon Plate",
      calories: 480,
      emoji: "🥚",
      tags: ["Keto", "High Protein"],
      items: [
        { name: "Scrambled Eggs (3)", kcal: 220 },
        { name: "Turkey Bacon (3 strips)", kcal: 105 },
        { name: "Cheddar Cheese (20g)", kcal: 80 },
        { name: "Sautéed Spinach", kcal: 25 },
        { name: "Butter (1 tsp)", kcal: 50 },
      ],
    },
    {
      id: "b5",
      name: "Açaí Berry Smoothie Bowl",
      calories: 370,
      emoji: "🍇",
      tags: ["Vegan", "High Carb"],
      items: [
        { name: "Açaí Packet (100g)", kcal: 130 },
        { name: "Frozen Blueberries (80g)", kcal: 50 },
        { name: "Oat Milk (150ml)", kcal: 65 },
        { name: "Granola (40g)", kcal: 160 },
        { name: "Sliced Banana (½)", kcal: 45 },
      ],
    },
    {
      id: "b6",
      name: "Protein Pancakes",
      calories: 440,
      emoji: "🥞",
      tags: ["High Protein", "Balanced"],
      items: [
        { name: "Protein Pancake Mix (80g)", kcal: 280 },
        { name: "Whey Protein (1 scoop)", kcal: 120 },
        { name: "Mixed Berries (60g)", kcal: 40 },
      ],
    },
  ],

  lunch: [
    {
      id: "l1",
      name: "Grilled Chicken & Quinoa Bowl",
      calories: 590,
      emoji: "🍗",
      tags: ["High Protein", "Balanced"],
      items: [
        { name: "Grilled Chicken Breast (150g)", kcal: 248 },
        { name: "Cooked Quinoa (120g)", kcal: 175 },
        { name: "Roasted Veggies", kcal: 90 },
        { name: "Olive Oil Drizzle", kcal: 80 },
      ],
    },
    {
      id: "l2",
      name: "Lentil & Vegetable Soup",
      calories: 420,
      emoji: "🍲",
      tags: ["Vegan", "Low Cal"],
      items: [
        { name: "Red Lentils (100g dry)", kcal: 230 },
        { name: "Carrots & Celery", kcal: 60 },
        { name: "Whole-Grain Bread (1 slice)", kcal: 90 },
        { name: "Olive Oil (1 tsp)", kcal: 40 },
      ],
    },
    {
      id: "l3",
      name: "Tuna Salad Wrap",
      calories: 490,
      emoji: "🌯",
      tags: ["High Protein", "Low Cal"],
      items: [
        { name: "Whole-Wheat Tortilla", kcal: 130 },
        { name: "Canned Tuna (120g)", kcal: 140 },
        { name: "Light Mayo (1 tbsp)", kcal: 50 },
        { name: "Mixed Greens & Tomato", kcal: 40 },
        { name: "Greek Yogurt (50g)", kcal: 40 },
        { name: "Sweet Potato Fries (80g baked)", kcal: 90 },
      ],
    },
    {
      id: "l4",
      name: "Keto Beef & Avocado Bowl",
      calories: 610,
      emoji: "🥩",
      tags: ["Keto", "High Protein"],
      items: [
        { name: "Ground Beef 80/20 (150g)", kcal: 330 },
        { name: "Avocado (½)", kcal: 120 },
        { name: "Cauliflower Rice (150g)", kcal: 55 },
        { name: "Sour Cream (2 tbsp)", kcal: 60 },
        { name: "Salsa (2 tbsp)", kcal: 15 },
        { name: "Cheddar (15g)", kcal: 60 },
      ],
    },
    {
      id: "l5",
      name: "Chickpea Buddha Bowl",
      calories: 510,
      emoji: "🫘",
      tags: ["Vegan", "High Carb"],
      items: [
        { name: "Roasted Chickpeas (100g)", kcal: 165 },
        { name: "Brown Rice (120g cooked)", kcal: 155 },
        { name: "Tahini Dressing (2 tbsp)", kcal: 90 },
        { name: "Cucumber & Tomato", kcal: 35 },
        { name: "Baby Spinach", kcal: 15 },
        { name: "Lemon Juice", kcal: 5 },
      ],
    },
    {
      id: "l6",
      name: "Turkey & Sweet Potato Plate",
      calories: 560,
      emoji: "🦃",
      tags: ["High Protein", "Balanced"],
      items: [
        { name: "Turkey Breast (150g)", kcal: 240 },
        { name: "Baked Sweet Potato (180g)", kcal: 163 },
        { name: "Steamed Green Beans", kcal: 44 },
        { name: "Olive Oil (1 tsp)", kcal: 40 },
        { name: "Grainy Mustard", kcal: 15 },
      ],
    },
  ],

  snack: [
    {
      id: "s1",
      name: "Greek Yogurt Parfait",
      calories: 280,
      emoji: "🍦",
      tags: ["High Protein", "Balanced"],
      items: [
        { name: "Greek Yogurt (150g)", kcal: 130 },
        { name: "Mixed Berries (60g)", kcal: 40 },
        { name: "Granola (30g)", kcal: 110 },
      ],
    },
    {
      id: "s2",
      name: "Hummus & Veggie Sticks",
      calories: 200,
      emoji: "🥕",
      tags: ["Vegan", "Low Cal"],
      items: [
        { name: "Hummus (60g)", kcal: 100 },
        { name: "Carrot Sticks (80g)", kcal: 33 },
        { name: "Celery (2 stalks)", kcal: 12 },
        { name: "Bell Pepper Strips", kcal: 25 },
        { name: "Cucumber Slices", kcal: 16 },
      ],
    },
    {
      id: "s3",
      name: "Protein Bar & Banana",
      calories: 340,
      emoji: "🍌",
      tags: ["High Protein", "High Carb"],
      items: [
        { name: "Whey Protein Bar (50g)", kcal: 200 },
        { name: "Banana (medium)", kcal: 105 },
        { name: "Water", kcal: 0 },
      ],
    },
    {
      id: "s4",
      name: "Keto Cheese & Almonds",
      calories: 310,
      emoji: "🧀",
      tags: ["Keto", "High Protein"],
      items: [
        { name: "Cheddar Cheese (40g)", kcal: 160 },
        { name: "Almonds (25g)", kcal: 145 },
        { name: "Olives (5 pieces)", kcal: 35 },
      ],
    },
    {
      id: "s5",
      name: "Apple & Almond Butter",
      calories: 250,
      emoji: "🍎",
      tags: ["Vegan", "Balanced"],
      items: [
        { name: "Apple (medium)", kcal: 95 },
        { name: "Almond Butter (1.5 tbsp)", kcal: 145 },
        { name: "Cinnamon pinch", kcal: 3 },
      ],
    },
    {
      id: "s6",
      name: "Cottage Cheese & Pineapple",
      calories: 220,
      emoji: "🍍",
      tags: ["High Protein", "Low Cal"],
      items: [
        { name: "Cottage Cheese (150g)", kcal: 130 },
        { name: "Fresh Pineapple (80g)", kcal: 65 },
        { name: "Chia Seeds (1 tsp)", kcal: 25 },
      ],
    },
  ],

  dinner: [
    {
      id: "d1",
      name: "Baked Salmon & Veggies",
      calories: 460,
      emoji: "🐟",
      tags: ["High Protein", "Balanced"],
      items: [
        { name: "Salmon Fillet (180g)", kcal: 290 },
        { name: "Roasted Asparagus", kcal: 50 },
        { name: "Cherry Tomatoes", kcal: 30 },
        { name: "Olive Oil (1 tbsp)", kcal: 90 },
      ],
    },
    {
      id: "d2",
      name: "Tofu Vegetable Stir-Fry",
      calories: 400,
      emoji: "🥦",
      tags: ["Vegan", "Low Cal"],
      items: [
        { name: "Firm Tofu (200g)", kcal: 145 },
        { name: "Broccoli & Snow Peas", kcal: 65 },
        { name: "Sesame Oil (1 tsp)", kcal: 40 },
        { name: "Soy Sauce & Ginger", kcal: 20 },
        { name: "Brown Rice (80g cooked)", kcal: 110 },
      ],
    },
    {
      id: "d3",
      name: "Chicken & Sweet Potato Bake",
      calories: 520,
      emoji: "🍠",
      tags: ["High Protein", "High Carb"],
      items: [
        { name: "Chicken Thigh (160g)", kcal: 290 },
        { name: "Sweet Potato (150g)", kcal: 130 },
        { name: "Olive Oil (1 tsp)", kcal: 40 },
        { name: "Mixed Herbs", kcal: 5 },
        { name: "Baby Spinach Side", kcal: 15 },
      ],
    },
    {
      id: "d4",
      name: "Keto Lamb Chops & Greens",
      calories: 540,
      emoji: "🍖",
      tags: ["Keto", "High Protein"],
      items: [
        { name: "Lamb Chops (180g)", kcal: 360 },
        { name: "Sautéed Kale (100g)", kcal: 50 },
        { name: "Garlic Butter (1 tbsp)", kcal: 100 },
        { name: "Lemon Wedge", kcal: 5 },
      ],
    },
    {
      id: "d5",
      name: "Black Bean Veggie Tacos",
      calories: 430,
      emoji: "🌮",
      tags: ["Vegan", "High Carb"],
      items: [
        { name: "Corn Tortillas (3)", kcal: 165 },
        { name: "Black Beans (100g)", kcal: 130 },
        { name: "Avocado Salsa (60g)", kcal: 80 },
        { name: "Shredded Cabbage", kcal: 20 },
        { name: "Lime Juice", kcal: 5 },
        { name: "Jalapeño", kcal: 4 },
      ],
    },
    {
      id: "d6",
      name: "Lean Beef & Zucchini Noodles",
      calories: 480,
      emoji: "🥗",
      tags: ["High Protein", "Low Cal"],
      items: [
        { name: "Lean Ground Beef (130g)", kcal: 260 },
        { name: "Zucchini Noodles (200g)", kcal: 35 },
        { name: "Marinara Sauce (80g)", kcal: 50 },
        { name: "Parmesan (15g)", kcal: 60 },
        { name: "Olive Oil (1 tsp)", kcal: 40 },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Meal Pools — diet-aware day generators
// ---------------------------------------------------------------------------

function makeDay(b, l, s, d, calTarget) {
  const bCal = Math.round((calTarget * 0.23));
  const lCal = Math.round((calTarget * 0.30));
  const sCal = Math.round((calTarget * 0.13));
  const dCal = calTarget - bCal - lCal - sCal;

  const mealColors = {
    breakfast: "#f97316",
    lunch: "#3b82f6",
    snack: "#a855f7",
    dinner: "#22c55e",
  };
  const mealTimes = {
    breakfast: "7:00 – 8:30 AM",
    lunch: "12:00 – 1:30 PM",
    snack: "3:00 – 4:00 PM",
    dinner: "7:00 – 8:30 PM",
  };

  const makeItems = (option, color) =>
    option.items.map((item) => ({ ...item, dot: color }));

  return [
    {
      id: "breakfast",
      label: "Breakfast",
      time: mealTimes.breakfast,
      calories: bCal,
      color: mealColors.breakfast,
      items: makeItems(b, mealColors.breakfast),
    },
    {
      id: "lunch",
      label: "Lunch",
      time: mealTimes.lunch,
      calories: lCal,
      color: mealColors.lunch,
      items: makeItems(l, mealColors.lunch),
    },
    {
      id: "snack",
      label: "Snack",
      time: mealTimes.snack,
      calories: sCal,
      color: mealColors.snack,
      items: makeItems(s, mealColors.snack),
    },
    {
      id: "dinner",
      label: "Dinner",
      time: mealTimes.dinner,
      calories: dCal,
      color: mealColors.dinner,
      items: makeItems(d, mealColors.dinner),
    },
  ];
}

const pick = (arr, tag) => {
  if (tag === "All") return arr[Math.floor(Math.random() * arr.length)];
  const filtered = arr.filter((x) => x.tags.includes(tag));
  const pool = filtered.length ? filtered : arr;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const mealPools = {
  Standard: {
    generateDay: (calTarget = 2000) => {
      const b = pick(mealAlternatives.breakfast, "Balanced");
      const l = pick(mealAlternatives.lunch, "Balanced");
      const s = pick(mealAlternatives.snack, "Balanced");
      const d = pick(mealAlternatives.dinner, "Balanced");
      return makeDay(b, l, s, d, calTarget);
    },
  },
  Vegan: {
    generateDay: (calTarget = 2000) => {
      const b = pick(mealAlternatives.breakfast, "Vegan");
      const l = pick(mealAlternatives.lunch, "Vegan");
      const s = pick(mealAlternatives.snack, "Vegan");
      const d = pick(mealAlternatives.dinner, "Vegan");
      return makeDay(b, l, s, d, calTarget);
    },
  },
  Keto: {
    generateDay: (calTarget = 2000) => {
      const b = pick(mealAlternatives.breakfast, "Keto");
      const l = pick(mealAlternatives.lunch, "Keto");
      const s = pick(mealAlternatives.snack, "Keto");
      const d = pick(mealAlternatives.dinner, "Keto");
      return makeDay(b, l, s, d, calTarget);
    },
  },
  "High-Protein": {
    generateDay: (calTarget = 2000) => {
      const b = pick(mealAlternatives.breakfast, "High Protein");
      const l = pick(mealAlternatives.lunch, "High Protein");
      const s = pick(mealAlternatives.snack, "High Protein");
      const d = pick(mealAlternatives.dinner, "High Protein");
      return makeDay(b, l, s, d, calTarget);
    },
  },
};
