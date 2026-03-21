import { Dumbbell, Heart, Zap, Leaf } from "lucide-react";

import img1 from "../../Assets/image1.jpeg";
import img2 from "../../Assets/image2.jpeg";
import img3 from "../../Assets/image3.jpeg";
import img4 from "../../Assets/image4.jpeg";
import img5 from "../../Assets/image5.jpeg";
import img6 from "../../Assets/image6.jpeg";
import img7 from "../../Assets/image7.jpeg";
import img8 from "../../Assets/image8.jpeg";
import img9 from "../../Assets/image9.jpeg";
import img11 from "../../Assets/image11.jpeg";
import sidePlank from "../../Assets/Side Plank.jpg";
import reverseCrunch from "../../Assets/Reverse Crunch.jpg";

export const ITEMS_PER_PAGE = 6;

export const categories = ["All", "Cardio", "Strength", "HIIT", "Yoga"];

export const categoryConfig = {
  All:      { icon: Dumbbell, bg: "bg-primary" },
  Cardio:   { icon: Heart,    bg: "bg-red-500"    },
  Strength: { icon: Dumbbell, bg: "bg-primary" },
  HIIT:     { icon: Zap,      bg: "bg-yellow-500" },
  Yoga:     { icon: Leaf,     bg: "bg-green-500"  },
};

export const levelColor = {
  Beginner:     "text-green-400 bg-green-500/10",
  Intermediate: "text-yellow-400 bg-yellow-500/10",
  Advanced:     "text-red-400 bg-red-500/10",
};

export const exercises = [
  {
    id: 1,
    name: "Treadmill Run",
    category: "Cardio",
    level: "Beginner",
    duration: "30 min",
    type: "Continuous",
    muscles: ["Legs", "Core"],
    calories: 280,
    description:
      "A steady-paced treadmill run to build cardiovascular endurance. Maintain a consistent pace and focus on your breathing rhythm throughout the session.",
    img: img1,
  },
  {
    id: 2,
    name: "Barbell Squat",
    category: "Strength",
    level: "Beginner",
    duration: "30 min",
    type: "Sets",
    muscles: ["Quads", "Glutes", "Core"],
    calories: 220,
    description:
      "A compound lower-body movement targeting the quads, hamstrings and glutes. Keep your chest up and drive through your heels on every rep.",
    img: img2,
  },
  {
    id: 3,
    name: "Burpees",
    category: "HIIT",
    level: "Beginner",
    duration: "30 min",
    type: "Circuit",
    muscles: ["Full Body"],
    calories: 350,
    description:
      "A full-body explosive movement combining a squat, plank and jump. Land softly with slightly bent knees and keep a steady rhythm.",
    img: img3,
  },
  {
    id: 4,
    name: "Sun Salutation",
    category: "Yoga",
    level: "Beginner",
    duration: "25 min",
    type: "Continuous",
    muscles: ["Full Body", "Flexibility"],
    calories: 120,
    description:
      "A flowing sequence of 12 yoga poses performed in a continuous flow. Sync each movement with your breath to build flexibility and body awareness.",
    img: img4,
  },
  {
    id: 5,
    name: "Box Jump",
    category: "HIIT",
    level: "Beginner",
    duration: "30 min",
    type: "Intervals",
    muscles: ["Legs", "Glutes"],
    calories: 300,
    description:
      "An explosive plyometric movement that develops lower-body power and coordination. Step down to protect your joints between reps.",
    img: img5,
  },
  {
    id: 6,
    name: "Jumping Jacks",
    category: "Cardio",
    level: "Beginner",
    duration: "20 min",
    type: "Continuous",
    muscles: ["Full Body"],
    calories: 180,
    description:
      "A classic calisthenic warm-up exercise that raises the heart rate and activates the entire body. Great as a warm-up or active rest between sets.",
    img: img6,
  },
  {
    id: 7,
    name: "Push-Ups",
    category: "Strength",
    level: "Intermediate",
    duration: "20 min",
    type: "Sets",
    muscles: ["Chest", "Triceps", "Shoulders"],
    calories: 160,
    description:
      "A fundamental bodyweight pressing movement for upper-body strength. Keep your body in a straight line from head to heels throughout each rep.",
    img: img7,
  },
  {
    id: 8,
    name: "Warrior Sequence",
    category: "Yoga",
    level: "Beginner",
    duration: "25 min",
    type: "Continuous",
    muscles: ["Legs", "Core", "Balance"],
    calories: 110,
    description:
      "A series of standing yoga poses that build strength, stability and mental focus. Hold each warrior pose for 5 full breaths before transitioning.",
    img: img8,
  },
  {
    id: 9,
    name: "Cycling Sprint",
    category: "Cardio",
    level: "Intermediate",
    duration: "45 min",
    type: "Intervals",
    muscles: ["Legs", "Cardiovascular"],
    calories: 400,
    description:
      "High-intensity cycling intervals that torch calories and build leg power. Alternate between all-out sprints and recovery periods.",
    img: img9,
  },
  {
    id: 10,
    name: "Bench Press",
    category: "Strength",
    level: "Intermediate",
    duration: "35 min",
    type: "Sets",
    muscles: ["Chest", "Shoulders", "Triceps"],
    calories: 200,
    description:
      "The king of upper-body pressing movements. Keep your shoulder blades retracted and feet flat on the floor for maximum stability.",
    img: img11,
  },
  {
    id: 11,
    name: "Plank Hold",
    category: "Strength",
    level: "Beginner",
    duration: "15 min",
    type: "Timed",
    muscles: ["Core", "Shoulders"],
    calories: 80,
    description:
      "An isometric core exercise that builds stability and endurance. Engage your core and glutes — don't let your hips drop or rise.",
    img: sidePlank,
  },
  {
    id: 12,
    name: "HIIT Circuit",
    category: "HIIT",
    level: "Advanced",
    duration: "40 min",
    type: "Circuit",
    muscles: ["Full Body"],
    calories: 480,
    description:
      "A brutal full-body circuit combining strength and cardio moves with minimal rest. Push through each station and recover between rounds.",
    img: reverseCrunch,
  },
];
