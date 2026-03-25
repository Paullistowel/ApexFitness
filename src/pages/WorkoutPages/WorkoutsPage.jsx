import { useState } from "react";
import WorkoutLibrary from "../WorkoutLibrary/WorkoutLibrary";
import StartWorkout from "./StartWorkpage/StartWorkout";

const TABS = [
  { id: "library", label: "Library"       },
  { id: "start",   label: "Start Workout" },
];

export default function WorkoutsPage() {
  const [activeTab, setActiveTab] = useState("library");

  return (
    <div className="min-h-full bg-surface">

      {/* Tab bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex gap-6 border-b border-border/10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                activeTab === t.id
                  ? "text-primary border-primary"
                  : "text-muted border-transparent hover:text-foreground/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "library" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <WorkoutLibrary />
        </div>
      )}
      {activeTab === "start" && <StartWorkout onDone={() => setActiveTab("library")} />}
    </div>
  );
}
