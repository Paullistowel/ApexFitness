import { useState } from "react";
import ProfileSidebar   from "./components/ProfileSidebar";
import EditProfileModal from "./components/EditProfileModal";
import OverviewTab      from "./components/OverviewTab";
import GoalsTab         from "./components/GoalsTab";
import AnalyticsTab     from "./components/AnalyticsTab";
import SettingsContent  from "../SettingsPage/SettingsContent";

const TABS = [
  { id: "overview",  label: "Overview"  },
  { id: "goals",     label: "Goals"     },
  { id: "analytics", label: "Analytics" },
  { id: "settings",  label: "Settings"  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab]         = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left: profile card */}
          <ProfileSidebar onEdit={() => setShowEditModal(true)} />

          {/* Right: tabbed content */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Tab bar */}
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

            {/* Content */}
            {activeTab === "overview"  && <OverviewTab onEdit={() => setShowEditModal(true)} />}
            {activeTab === "goals"     && <GoalsTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "settings"  && <SettingsContent />}
          </div>
        </div>
      </div>

      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
}
