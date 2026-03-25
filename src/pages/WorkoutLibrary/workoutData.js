import { Dumbbell, Heart, Zap, Leaf } from "lucide-react";

export const ITEMS_PER_PAGE = 6;

export const categories = ["All", "Strength", "Cardio", "HIIT", "Flexibility"];

export const categoryConfig = {
  All: { icon: Dumbbell, bg: "bg-primary" },
  Strength: { icon: Dumbbell, bg: "bg-primary" },
  Cardio: { icon: Heart, bg: "bg-red-500" },
  HIIT: { icon: Zap, bg: "bg-yellow-500" },
  Flexibility: { icon: Leaf, bg: "bg-green-500" },
};

export const levelColor = {
  Beginner: "text-green-400 bg-green-500/10",
  Intermediate: "text-yellow-400 bg-yellow-500/10",
  Advanced: "text-red-400 bg-red-500/10",
};

export const exercises = [
  {
    id: 1,
    name: "Push-ups",
    category: "Strength",
    level: "Beginner",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
    muscles: ["Chest", "Shoulders", "Triceps"],
    duration: "10–15 min",
    calories: 100,
  },
  {
    id: 2,
    name: "Running",
    category: "Cardio",
    level: "Intermediate",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    muscles: ["Legs", "Cardio"],
    duration: "30–45 min",
    calories: 300,
  },
  {
    id: 3,
    name: "Burpees",
    category: "HIIT",
    level: "Advanced",
    img: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80",
    muscles: ["Full Body"],
    duration: "20–30 min",
    calories: 250,
  },
  {
    id: 4,
    name: "Yoga Flow",
    category: "Flexibility",
    level: "Beginner",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    muscles: ["Core", "Back"],
    duration: "30–45 min",
    calories: 150,
  },
];
