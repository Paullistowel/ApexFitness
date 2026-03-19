// ─── MOCK DATA ─────────────────────────────────────────────────────────────
// Replace these with real API calls when backend is ready.

import TreadmillRun from "../assets/image1.jpeg";



export const MOCK_USER = {
  id: "u1",
  name: "Emmanuel Acquah",
  shortName: "Emmanuel",
  initials: "EA",
  memberType: "Pro Member",
  goal: "Weight Loss",
  notifications: 3,
};

export const MOCK_DASHBOARD = {
  caloriesBurned: 450,
  caloriesChange: 12,
  waterConsumed: 8.5,
  waterChange: 12,
  activeMinutes: 35,
  activeGoal: 45,
  weightTrend: [
    { day: "Mon",   weight: 86   },
    { day: "Tues",  weight: 85.2 },
    { day: "Wed",   weight: 84.5 },
    { day: "Thurs", weight: 84.1 },
    { day: "Fri",   weight: 83.4 },
    { day: "Sat",   weight: 82.8 },
    { day: "Sun",   weight: 81.5 },
  ],
  activeSummary: [
    { day: "Mon",   steps: 4500, workout: 30 },
    { day: "Tues",  steps: 2000, workout: 20 },
    { day: "Wed",   steps: 3800, workout: 25 },
    { day: "Thurs", steps: 3200, workout: 15 },
    { day: "Fri",   steps: 2800, workout: 20 },
    { day: "Sat",   steps: 3500, workout: 40 },
    { day: "Sun",   steps: 4800, workout: 45 },
  ],
};



export const MOCK_EXERCISES = [
  {
    id: 1, name: "Treadmill Run", category: "Cardio",
    difficulty: "Beginner", duration: 30, type: "Continuous",
    description: "Steady-pace run on treadmill to build cardiovascular endurance.",
    image: TreadmillRun,
  },
  {
    id: 2, name: "Barbell Squat", category: "Strength",
    difficulty: "Beginner", duration: 30, type: "Continuous",
    description: "Compound lower-body movement targeting quads, glutes, and hamstrings.",
    image: "https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=400&q=80",
  },
  {
    id: 3, name: "Burpees", category: "HIIT",
    difficulty: "Beginner", duration: 30, type: "Continuous",
    description: "Full-body explosive movement combining squat, plank, and jump.",
    image: "https://cdn.calisteniapp.com/09_2024/images/exercise/full/EX188.jpg",
  },
  {
    id: 4, name: "Sun Salutation", category: "Yoga",
    difficulty: "Beginner", duration: 30, type: "Continuous",
    description: "A flowing sequence of 12 yoga poses performed in the morning.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
  },
  {
    id: 5, name: "Box Jump", category: "HIIT",
    difficulty: "Beginner", duration: 30, type: "Continuous",
    description: "Plyometric exercise involving jumping onto and off a raised platform.",
    image: "https://imagely.mirafit.co.uk/wp/wp-content/uploads/2023/02/woman-jumping-on-a-Mirafit-Hybrid-Plyo-Jump-Box-1024x683.jpg",
  },
  {
    id: 6, name: "Jumping Jacks", category: "Cardio",
    difficulty: "Beginner", duration: 30, type: "Continuous",
    description: "Land softly with slightly bent knees. Keep a steady rhythm.",
    image: "https://assets.nutrisense.io/62e18da95149ec2ee0d87b5b/65b0d643eb8c14b2ff3c6eaf_thumbnail-image-65ae476a9d643.webp",
  },
  {
    id: 7, name: "Push-Ups", category: "Strength",
    difficulty: "Beginner", duration: 20, type: "Sets",
    description: "Classic upper-body push movement targeting chest, shoulders, and triceps.",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80",
  },
  {
    id: 8, name: "Cycling Sprint", category: "Cardio",
    difficulty: "Intermediate", duration: 25, type: "Interval",
    description: "High-intensity cycling intervals to maximize calorie burn.",
    image: "https://c02.purpledshub.com/uploads/sites/39/2023/02/Penni-123-a1564ab.jpg?webp=1&w=1200",
  },
  {
    id: 9, name: "Warrior Sequence", category: "Yoga",
    difficulty: "Intermediate", duration: 40, type: "Continuous",
    description: "Series of standing yoga poses to build strength and balance.",
    image: "https://www.verywellfit.com/thmb/56AayW1tVPCe7jSaIq8GB5xvJg4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Verywell-03-3567198-Warrior2-aa285698e49a48e5b9e7cb890ae26bb3.jpg",
  },
  {
    id: 10, name: "Bench Press", category: "Strength",
    difficulty: "Intermediate", duration: 45, type: "Sets",
    description: "Horizontal pressing movement for upper body strength.",
    image: "https://images.ctfassets.net/8urtyqugdt2l/2bMyO0jZaRJjfRptw60iwG/17c391156dd01ae6920c672cc2744fb1/desktop-bench-press.jpg",
  },
  {
    id: 11, name: "Deadlift", category: "Strength",
    difficulty: "Advanced", duration: 45, type: "Sets",
    description: "Full-body posterior chain movement — the king of all lifts.",
    image: "https://invigorhealth.com.au/wp-content/uploads/2025/11/InvigorHealth-girl-performing-deadlift-exercise.jpg",
  },
  {
    id: 12, name: "Mountain Climbers", category: "HIIT",
    difficulty: "Beginner", duration: 15, type: "Interval",
    description: "Dynamic core exercise that rapidly elevates the heart rate.",
    image: "https://www.soletreadmills.com/cdn/shop/articles/A_man_doing_mountain_climbers_356ab9c7-1e19-4fe1-8182-9ab1cd28e51b.png?v=1773071842&width=1200",
  },
];

// Helper: look up an exercise image from MOCK_EXERCISES by id
const _imgById = (id: number) => {
  const ex = MOCK_EXERCISES.find((e: any) => e.id === id);
  return ex ? ex.image : null;
};

export const INITIAL_WORKOUT_PLAN = {
  Mon: {
    type: "Strength",
    exerciseDetails: [
      { id: 2,  name: "Barbell Squat", sets: 4, reps: 10, image: _imgById(2)  },
      { id: 10, name: "Bench Press",   sets: 4, reps: 10, image: _imgById(10) },
    ],
  },
  Tues: {
    type: "Cardio",
    exerciseDetails: [
      { id: 1, name: "Treadmill Run",  sets: 3, reps: 12, image: _imgById(1) },
      { id: 8, name: "Cycling Sprint", sets: 4, reps: 8,  image: _imgById(8) },
    ],
  },
  Wed: {
    type: "HIIT",
    exerciseDetails: [
      { id: 5, name: "Box Jump", sets: 4, reps: 10, image: _imgById(5) },
    ],
  },
  Thurs: { type: "Rest", exerciseDetails: [] },
  Fri: {
    type: "Strength",
    exerciseDetails: [
      { id: 7, name: "Push-Ups", sets: 3, reps: 15, image: _imgById(7) },
    ],
  },
  Sat: {
    type: "Yoga",
    exerciseDetails: [
      { id: 4, name: "Sun Salutation",   sets: 2, reps: 12, image: _imgById(4) },
      { id: 9, name: "Warrior Sequence", sets: 3, reps: 10, image: _imgById(9) },
    ],
  },
  Sun: { type: "Rest", exerciseDetails: [] },
};

export const DAYS = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
export const TODAY_DAY = "Fri";
export const EXERCISE_CATEGORIES = ["All", "Cardio", "Strength", "HIIT", "Yoga"];
export const EXERCISES_PER_PAGE = 6;
