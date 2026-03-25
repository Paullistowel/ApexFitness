import { useState, useEffect } from "react";
import {
  Dumbbell, Droplets, Salad, Moon, Sun, Lock, Mail,
  CreditCard, LogOut, Shield, HelpCircle, FileText,
  ChevronRight, X, Eye, EyeOff, AlertCircle,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import useAuthStore from "../../store/authStore";
import api from "../../lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionCard({ title, children }) {
  return (
    <div className="bg-overlay/5 border border-border/10 rounded-2xl px-5 overflow-hidden">
      <p className="text-xs font-black text-muted uppercase tracking-widest pt-4 pb-1">{title}</p>
      <div className="divide-y divide-border/5">{children}</div>
    </div>
  );
}

function SettingToggle({ label, description, value, onChange, icon: Icon, color = "bg-primary" }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-overlay/10 flex items-center justify-center">
            <Icon size={14} className="text-muted" />
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-foreground">{label}</p>
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? color : "bg-overlay/10"}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function SettingRow({ label, description, value, icon: Icon, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-3.5 -mx-5 px-5 transition-colors rounded-2xl ${danger ? "hover:bg-red-500/10" : "hover:bg-overlay/5"}`}
    >
      {Icon && (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${danger ? "bg-red-500/15" : "bg-overlay/10"}`}>
          <Icon size={14} className={danger ? "text-red-400" : "text-muted"} />
        </div>
      )}
      <div className="flex-1 text-left">
        <p className={`text-sm font-bold ${danger ? "text-red-400" : "text-foreground"}`}>{label}</p>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      {value && <span className="text-xs text-muted">{value}</span>}
      {!danger && <ChevronRight size={14} className="text-muted" />}
    </button>
  );
}

function PasswordModal({ onClose }) {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [vals, setVals] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState("");
  const set    = (k, v) => setVals((p) => ({ ...p, [k]: v }));
  const toggle = (k)    => setShow((p) => ({ ...p, [k]: !p[k] }));
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () => api.put("/password", { currentPassword: vals.current, newPassword: vals.new }),
    onSuccess: () => {
      toast.success("Password Updated", "Your password has been changed successfully.");
      onClose();
    },
    onError: (err) => setError(err.response?.data?.message || "Failed to update password."),
  });

  const handleUpdate = () => {
    if (!vals.current || !vals.new || vals.new !== vals.confirm) return;
    setError("");
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-foreground">Update Password</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-overlay/10 flex items-center justify-center">
            <X size={15} className="text-muted" />
          </button>
        </div>
        {[
          { key: "current", label: "Current Password" },
          { key: "new",     label: "New Password"     },
          { key: "confirm", label: "Confirm Password" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">{label}</label>
            <div className="relative mt-1.5">
              <input
                type={show[key] ? "text" : "password"}
                value={vals[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder="••••••••"
                className="w-full bg-overlay/5 border border-border/10 text-foreground placeholder-gray-600 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button onClick={() => toggle(key)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground/80">
                {show[key] ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        ))}
        {vals.new && vals.confirm && vals.new !== vals.confirm && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20">
            <AlertCircle size={13} /> Passwords do not match
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20">
            <AlertCircle size={13} /> {error}
          </div>
        )}
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={!vals.current || !vals.new || vals.new !== vals.confirm || mutation.isPending}
            className="flex-1 py-3 bg-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl text-sm font-bold text-foreground transition-colors"
          >
            {mutation.isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Exported content (no page wrapper) ───────────────────────────────────────
export default function SettingsContent() {
  const logout = useAuthStore((s) => s.logout);
  const { toast } = useToast();
  const { theme, toggle } = useTheme();
  const [notif, setNotif]               = useState({ workout: true, water: true, diet: false });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((r) => r.data),
  });

  // Populate toggles from real settings on load
  useEffect(() => {
    const s = profileData?.settings;
    if (!s) return;
    setNotif({ workout: s.notif_workout, water: s.notif_water, diet: s.notif_diet });
  }, [profileData]);

  const settingsMutation = useMutation({
    mutationFn: (payload) => api.put("/settings", payload),
    onError: () => toast.error("Error", "Failed to save settings."),
  });

  const toggleNotif = (k) => {
    const updated = { ...notif, [k]: !notif[k] };
    setNotif(updated);
    settingsMutation.mutate({
      notif_workout: updated.workout,
      notif_water:   updated.water,
      notif_diet:    updated.diet,
    });
  };

  return (
    <>
      <div className="space-y-4">
        <SectionCard title="Notifications">
          <SettingToggle
            label="Workout Reminders" description="Get notified before scheduled workouts"
            icon={Dumbbell} value={notif.workout} onChange={() => toggleNotif("workout")}
          />
          <SettingToggle
            label="Water Reminders" description="Hydration prompts throughout the day"
            icon={Droplets} value={notif.water} onChange={() => toggleNotif("water")}
            color="bg-blue-500"
          />
          <SettingToggle
            label="Diet Plan Updates" description="When your meal plan changes"
            icon={Salad} value={notif.diet} onChange={() => toggleNotif("diet")}
            color="bg-green-500"
          />
        </SectionCard>

        <SectionCard title="Appearance">
          <SettingToggle
            label="Dark Mode" description="Switch to a darker interface theme"
            icon={theme === "dark" ? Moon : Sun} value={theme === "dark"} onChange={toggle}
            color="bg-gray-700"
          />
        </SectionCard>

        <SectionCard title="Account">
          <SettingRow
            label="Update Password" description="Change your account password"
            icon={Lock} onClick={() => setShowPasswordModal(true)}
          />
          <SettingRow label="Change Email" description={profileData?.user?.email ?? "—"} icon={Mail} onClick={() => {}} />
          <SettingRow
            label="Manage Subscription" description="Pro Plan · Renews Apr 1, 2026"
            icon={CreditCard} onClick={() => {}}
          />
        </SectionCard>

        <SectionCard title="Support & About">
          <SettingRow label="Help Center"      icon={HelpCircle} onClick={() => {}} />
          <SettingRow label="Privacy Policy"   icon={Shield}     onClick={() => {}} />
          <SettingRow label="Terms of Service" icon={FileText}   onClick={() => {}} />
        </SectionCard>

        <SectionCard title="Danger Zone">
          <SettingRow label="Log Out" icon={LogOut} onClick={logout} danger />
        </SectionCard>

        <p className="text-center text-xs text-muted pb-2">
          ApexFitness v1.0.0 · © 2026 ApexFitness Technologies Ltd.
        </p>
      </div>

      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}
    </>
  );
}
