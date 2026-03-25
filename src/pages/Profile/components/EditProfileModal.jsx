import { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../../store/authStore";
import api from "../../../lib/api";

// Defined outside the component so it's never recreated on re-render
function Field({ label, field, type = "text", options, value, onChange }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-muted uppercase tracking-wider">{label}</label>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-elevated">{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      )}
    </div>
  );
}

export default function EditProfileModal({ onClose }) {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((r) => r.data),
  });

  const [form, setForm] = useState({
    name: "", email: "", age: "", height: "", weight: "",
    goal: "Weight Loss", activity: "beginner", targetWeight: "",
  });
  const [error, setError] = useState("");

  // Populate form once profile data loads
  useEffect(() => {
    if (!profileData) return;
    const p = profileData.profile ?? {};
    setForm({
      name:         user?.name           ?? "",
      email:        user?.email          ?? "",
      age:          p.age            ?? "",
      height:       p.height_cm      ?? "",
      weight:       p.weight_kg      ?? "",
      goal:         p.primary_goal   ?? "Weight Loss",
      activity:     p.fitness_level  ?? "beginner",
      targetWeight: p.goal_weight_kg ?? "",
    });
  }, [profileData, user]);

  const saveMutation = useMutation({
    mutationFn: (payload) => api.put("/profile", payload),
    onSuccess: () => {
      setUser({ ...user, name: form.name });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      onClose();
    },
    onError: (err) => setError(err.response?.data?.message || "Failed to save changes."),
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    setError("");
    saveMutation.mutate({
      name:            form.name,
      age:             form.age       ? Number(form.age)          : undefined,
      height_cm:       form.height    ? Number(form.height)       : undefined,
      weight_kg:       form.weight    ? Number(form.weight)       : undefined,
      goal_weight_kg:  form.targetWeight ? Number(form.targetWeight) : undefined,
      primary_goal:  form.goal,
      fitness_level: form.activity,
    });
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl w-full max-w-lg shadow-2xl z-10 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/10 shrink-0">
          <div>
            <h3 className="text-base font-black text-foreground">Edit Profile</h3>
            <p className="text-xs text-muted mt-0.5">Update your personal information</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-overlay/10 flex items-center justify-center hover:bg-overlay/15 transition-colors">
            <X size={15} className="text-muted" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Avatar */}
          <div className="flex items-center gap-4 p-4 bg-overlay/5 rounded-2xl border border-border/10">
            <div className="relative shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-foreground text-xl font-black">
                  {initials}
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-elevated border border-border/20 flex items-center justify-center shadow hover:bg-overlay/10 transition-colors">
                <Camera size={11} className="text-muted" />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Profile Photo</p>
              <p className="text-xs text-muted mt-0.5">JPG or PNG, max 2MB</p>
            </div>
          </div>

          {/* Personal info */}
          <div>
            <p className="text-xs font-black text-muted uppercase tracking-widest mb-3">Personal Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Field label="Full Name" field="name" value={form.name} onChange={set} /></div>
              <div className="col-span-2">
                <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-muted rounded-xl px-4 py-2.5 text-sm cursor-not-allowed opacity-60"
                />
              </div>
              <Field label="Age" field="age" type="number" value={form.age} onChange={set} />
              <Field label="Height (cm)" field="height" type="number" value={form.height} onChange={set} />
            </div>
          </div>

          {/* Fitness info */}
          <div>
            <p className="text-xs font-black text-muted uppercase tracking-widest mb-3">Fitness Profile</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Current Weight (kg)" field="weight" type="number" value={form.weight} onChange={set} />
              <Field label="Target Weight (kg)"  field="targetWeight" type="number" value={form.targetWeight} onChange={set} />
              <Field label="Primary Goal" field="goal" value={form.goal} onChange={set}
                options={["Weight Loss", "Muscle Gain", "Maintain Weight", "Endurance"]}
              />
              <Field label="Fitness Level" field="activity" value={form.activity} onChange={set}
                options={["beginner", "intermediate", "advanced"]}
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border/10 shrink-0">
          <button onClick={onClose} className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="flex-1 py-3 bg-primary rounded-2xl text-sm font-bold text-foreground transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saveMutation.isPending && (
              <div className="w-4 h-4 border-2 border-foreground/40 border-t-foreground rounded-full animate-spin" />
            )}
            {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
