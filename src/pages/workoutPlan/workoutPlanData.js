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

const DAY_MAP = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
export const todayDay = DAY_MAP[new Date().getDay()];

export const categoryColor = {
  Strength: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary",  border: "border-primary/30" },
  Cardio:   { bg: "bg-red-500/10",    text: "text-red-400",    dot: "bg-red-500",     border: "border-red-500/30"    },
  HIIT:     { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-500",  border: "border-yellow-500/30" },
  Yoga:     { bg: "bg-green-500/10",  text: "text-green-400",  dot: "bg-green-500",   border: "border-green-500/30"  },
  Rest:     { bg: "bg-overlay/5",       text: "text-muted",   dot: "bg-gray-600",    border: "border-border/10"      },
};

export const initialPlan = [
  {
    day: "Monday", short: "Mon", isRest: false, category: "Strength", duration: 45,
    exercises: [
      { id: 1, name: "Barbell Squat",  sets: 4, reps: 10, img: img2  },
      { id: 2, name: "Bench Press",    sets: 4, reps: 8,  img: img3  },
      { id: 3, name: "Bent-Over Row",  sets: 3, reps: 10, img: img4  },
    ],
  },
  {
    day: "Tuesday", short: "Tues", isRest: false, category: "Cardio", duration: 30,
    exercises: [
      { id: 4, name: "Treadmill Run",   sets: 1, reps: null, img: img1 },
      { id: 5, name: "Cycling Sprint",  sets: 4, reps: null, img: img5 },
    ],
  },
  {
    day: "Wednesday", short: "Wed", isRest: false, category: "HIIT", duration: 30,
    exercises: [
      { id: 6, name: "Box Jumps", sets: 3, reps: 12, img: img6 },
      { id: 7, name: "Burpees",   sets: 3, reps: 15, img: img7 },
    ],
  },
  {
    day: "Thursday", short: "Thurs", isRest: true, category: "Rest", duration: 0,
    exercises: [],
  },
  {
    day: "Friday", short: "Fri", isRest: false, category: "Strength", duration: 30,
    exercises: [
      { id: 8, name: "Push-Ups",      sets: 4, reps: 15, img: img8 },
      { id: 9, name: "Barbell Squat", sets: 4, reps: 10, img: img2 },
    ],
  },
  {
    day: "Saturday", short: "Sat", isRest: false, category: "Yoga", duration: 30,
    exercises: [
      { id: 10, name: "Sun Salutation",   sets: 2, reps: null, img: img9  },
      { id: 11, name: "Warrior Sequence", sets: 2, reps: null, img: img11 },
    ],
  },
  {
    day: "Sunday", short: "Sun", isRest: true, category: "Rest", duration: 0,
    exercises: [],
  },
];
