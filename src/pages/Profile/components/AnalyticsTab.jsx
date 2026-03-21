import { useState } from "react";
import WeightTrendChart from "../../../components/Shared/WeightTrendChart";
import ActivityChart from "../../../components/Shared/ActivityChart";

const weight7 = [
  { day: "Mon", weight: 86 }, { day: "Tue", weight: 84 },
  { day: "Wed", weight: 83 }, { day: "Thu", weight: 82.5 },
  { day: "Fri", weight: 83 }, { day: "Sat", weight: 82 },
  { day: "Sun", weight: 81 },
];
const weight30 = [
  { day: "1",  weight: 90   }, { day: "2",  weight: 89.5 }, { day: "3",  weight: 89   },
  { day: "4",  weight: 88.8 }, { day: "5",  weight: 88.5 }, { day: "6",  weight: 88   },
  { day: "7",  weight: 87.5 }, { day: "8",  weight: 87.8 }, { day: "9",  weight: 87.2 },
  { day: "10", weight: 87   }, { day: "11", weight: 86.5 }, { day: "12", weight: 86.2 },
  { day: "13", weight: 86   }, { day: "14", weight: 85.8 }, { day: "15", weight: 85.5 },
  { day: "16", weight: 85.8 }, { day: "17", weight: 85.2 }, { day: "18", weight: 85   },
  { day: "19", weight: 84.5 }, { day: "20", weight: 84.2 }, { day: "21", weight: 84   },
  { day: "22", weight: 83.8 }, { day: "23", weight: 83.5 }, { day: "24", weight: 83.2 },
  { day: "25", weight: 83   }, { day: "26", weight: 82.5 }, { day: "27", weight: 82.2 },
  { day: "28", weight: 82   }, { day: "29", weight: 81.5 }, { day: "30", weight: 81   },
];
const stepsData = [
  { day: "Mon", value: 4500 }, { day: "Tue", value: 2000 },
  { day: "Wed", value: 3200 }, { day: "Thu", value: 3500 },
  { day: "Fri", value: 3800 }, { day: "Sat", value: 2800 },
  { day: "Sun", value: 4800 },
];
const workoutData = [
  { day: "Mon", value: 45 }, { day: "Tue", value: 0  },
  { day: "Wed", value: 30 }, { day: "Thu", value: 60 },
  { day: "Fri", value: 50 }, { day: "Sat", value: 20 },
  { day: "Sun", value: 75 },
];

export default function AnalyticsTab() {
  const [weightRange, setWeightRange] = useState("7 days");
  const [activityTab, setActivityTab] = useState("Steps");

  const weightData   = weightRange === "7 days" ? weight7 : weight30;
  const weightDomain = weightRange === "7 days" ? [80, 87] : [80, 91];
  const activityData = activityTab === "Steps" ? stepsData : workoutData;
  const activityFormatter = activityTab === "Steps"
    ? (v) => [v.toLocaleString(), "Steps"]
    : (v) => [`${v} min`, "Workout"];

  return (
    <div className="space-y-4">
      <WeightTrendChart
        data={weightData}
        domain={weightDomain}
        range={weightRange}
        onRangeChange={setWeightRange}
        subtitle={weightRange === "30 days" ? "−9 kg over 30 days" : "This week"}
      />
      <ActivityChart
        data={activityData}
        tab={activityTab}
        onTabChange={setActivityTab}
        formatter={activityFormatter}
        subtitle={activityTab === "Steps" ? "Daily steps this week" : "Workout minutes this week"}
      />
    </div>
  );
}
