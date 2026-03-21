import { useState } from "react";
import { Camera, X } from "lucide-react";

export default function EditProfileModal({ onClose }) {
  const [form, setForm] = useState({
    name: "Emmanuel Acquah",
    email: "emma@gmail.com",
    age: "23",
    height: "175",
    weight: "82",
    goal: "Weight Loss",
    activity: "Moderately Active",
    diet: "Vegan",
    targetWeight: "75",
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const Field = ({ label, field, type = "text", options }) => (
    <div>
      <label className="text-[11px] font-bold text-muted uppercase tracking-wider">{label}</label>
      {options ? (
        <select
          value={form[field]}
          onChange={(e) => set(field, e.target.value)}
          className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-elevated">{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={(e) => set(field, e.target.value)}
          className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      )}
    </div>
  );

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
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-overlay/10 flex items-center justify-center hover:bg-overlay/15 transition-colors"
          >
            <X size={15} className="text-muted" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Avatar */}
          <div className="flex items-center gap-4 p-4 bg-overlay/5 rounded-2xl border border-border/10">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-foreground text-xl font-black">
                EA
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-elevated border border-border/20 flex items-center justify-center shadow hover:bg-overlay/10 transition-colors">
                <Camera size={11} className="text-muted" />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Profile Photo</p>
              <p className="text-xs text-muted mt-0.5">JPG or PNG, max 2MB</p>
              <button className="mt-2 text-xs font-bold text-primary hover:text-primary transition-colors">
                Upload Photo
              </button>
            </div>
          </div>

          {/* Personal info */}
          <div>
            <p className="text-xs font-black text-muted uppercase tracking-widest mb-3">Personal Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Field label="Full Name" field="name" /></div>
              <div className="col-span-2"><Field label="Email Address" field="email" type="email" /></div>
              <Field label="Age" field="age" type="number" />
              <Field label="Height (cm)" field="height" type="number" />
            </div>
          </div>

          {/* Fitness info */}
          <div>
            <p className="text-xs font-black text-muted uppercase tracking-widest mb-3">Fitness Profile</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Current Weight (kg)" field="weight" type="number" />
              <Field label="Target Weight (kg)" field="targetWeight" type="number" />
              <Field
                label="Primary Goal" field="goal"
                options={["Weight Loss", "Muscle Gain", "Maintain Weight", "Endurance"]}
              />
              <Field
                label="Activity Level" field="activity"
                options={["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Super Active"]}
              />
              <div className="col-span-2">
                <Field
                  label="Diet Preference" field="diet"
                  options={["No Preference", "Vegan", "Vegetarian", "Keto", "Paleo", "Gluten-Free"]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border/10 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-primary hover:bg-primary rounded-2xl text-sm font-bold text-foreground transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
