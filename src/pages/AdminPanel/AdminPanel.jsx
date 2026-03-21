import { useState, useRef } from "react";
import {
  Users, Dumbbell, Search, MoreVertical, Ban, CheckCircle2,
  Trash2, Plus, Pencil, X, Check, Shield, Crown,
  Zap, Leaf, Heart, ImagePlus, Upload,
} from "lucide-react";

function Badge({ label, color }) {
  const colors = {
    green:  "bg-green-500/15 text-green-400 border border-green-500/20",
    red:    "bg-red-500/15 text-red-400 border border-red-500/20",
    orange: "bg-primary/15 text-primary border border-primary/20",
    gray:   "bg-overlay/10 text-muted border border-border/10",
    blue:   "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    yellow: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
    purple: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${colors[color] || colors.gray}`}>
      {label}
    </span>
  );
}

function Avatar({ initials, color = "#f97316", size = "md" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-black text-foreground shrink-0`}
      style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onClose, danger = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${danger ? "bg-red-500/15" : "bg-primary/15"}`}>
            {danger ? <Ban size={18} className="text-red-400" /> : <CheckCircle2 size={18} className="text-primary" />}
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">{title}</h3>
            <p className="text-xs text-muted mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold text-foreground transition-colors ${danger ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary"}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

const initialUsers = [
  { id: 1, name: "Emmanuel Acquah", email: "emma@gmail.com",   role: "user",    plan: "Pro",   status: "active",    joined: "Jan 2026",  goal: "Weight Loss",   initials: "EA", color: "#f97316" },
  { id: 2, name: "Akua Mensah",     email: "akua@gmail.com",   role: "user",    plan: "Free",  status: "active",    joined: "Feb 2026",  goal: "Muscle Gain",   initials: "AM", color: "#3b82f6" },
  { id: 3, name: "Kofi Acheampong", email: "kofi@gmail.com",   role: "user",    plan: "Pro",   status: "suspended", joined: "Jan 2026",  goal: "Maintain",      initials: "KA", color: "#a855f7" },
  { id: 4, name: "Ama Darko",       email: "ama@gmail.com",    role: "user",    plan: "Free",  status: "active",    joined: "Mar 2026",  goal: "Weight Loss",   initials: "AD", color: "#22c55e" },
  { id: 5, name: "Kwame Boateng",   email: "kwame@gmail.com",  role: "user",    plan: "Pro",   status: "active",    joined: "Feb 2026",  goal: "Muscle Gain",   initials: "KB", color: "#ef4444" },
  { id: 6, name: "Emefa Agbeko",    email: "emefa@gmail.com",  role: "user",    plan: "Pro",   status: "active",    joined: "Dec 2025",  goal: "Maintain",      initials: "EF", color: "#eab308" },
];

function UserRow({ user, onBan, onActivate, onDelete, onChangeRole }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusColor = { active: "green", suspended: "red", banned: "gray" };
  const planColor   = { Pro: "orange", Free: "blue" };
  const roleColor   = { user: "gray", admin: "orange" };

  return (
    <tr className="border-b border-border/10 hover:bg-overlay/5 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar initials={user.initials} color={user.color} size="sm" />
          <div>
            <p className="text-sm font-bold text-foreground">{user.name}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5"><Badge label={user.role} color={roleColor[user.role]} /></td>
      <td className="px-4 py-3.5"><Badge label={user.plan} color={planColor[user.plan]} /></td>
      <td className="px-4 py-3.5"><Badge label={user.status} color={statusColor[user.status]} /></td>
      <td className="px-4 py-3.5 text-xs text-muted">{user.joined}</td>
      <td className="px-4 py-3.5 text-xs text-muted">{user.goal}</td>
      <td className="px-4 py-3.5 relative">
        <button onClick={() => setMenuOpen((p) => !p)}
          className="w-8 h-8 rounded-full hover:bg-overlay/10 flex items-center justify-center transition-colors">
          <MoreVertical size={15} className="text-muted" />
        </button>
        {menuOpen && (
          <div className="absolute right-4 top-10 bg-elevated border border-border/10 rounded-2xl shadow-xl z-20 py-1 min-w-[160px]">
            {user.status === "active"
              ? <button onClick={() => { onBan(user.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                  <Ban size={13} /> Suspend User
                </button>
              : <button onClick={() => { onActivate(user.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-green-400 hover:bg-green-500/10 transition-colors">
                  <CheckCircle2 size={13} /> Activate User
                </button>
            }
            <button onClick={() => { onChangeRole(user.id); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-foreground/80 hover:bg-overlay/5 transition-colors">
              <UserCheck size={13} /> Change Role
            </button>
            <button onClick={() => { onDelete(user.id); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

function UsersTab() {
  const [users, setUsers]   = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(null);

  const ban      = (id) => setUsers((p) => p.map((u) => u.id === id ? { ...u, status: "suspended" } : u));
  const activate = (id) => setUsers((p) => p.map((u) => u.id === id ? { ...u, status: "active" }    : u));
  const remove   = (id) => setUsers((p) => p.filter((u) => u.id !== id));
  const changeRole = (id) => setUsers((p) => p.map((u) => u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u));

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : filter === "pro" ? u.plan === "Pro" : filter === "suspended" ? u.status === "suspended" : filter === "admin" ? u.role === "admin" : true;
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: "Total Users", value: users.length, color: "#f97316" },
    { label: "Pro Members", value: users.filter((u) => u.plan === "Pro").length, color: "#22c55e" },
    { label: "Suspended",   value: users.filter((u) => u.status === "suspended").length, color: "#ef4444" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-overlay/5 border border-border/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "26" }}>
              <Users size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-black text-foreground">{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all" />
        </div>
        <div className="flex gap-12 border-b border-border/10">
          {["all", "pro", "admin", "suspended"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`pb-2 text-sm font-semibold border-b-2 -mb-px transition-all capitalize ${filter === f ? "text-primary border-primary" : "text-muted border-transparent hover:text-foreground/80"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border/10 bg-overlay/5">
              {["User", "Role", "Plan", "Status", "Joined", "Goal", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-black text-muted uppercase tracking-wider first:px-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <UserRow key={u.id} user={u}
                onBan={(id) => setConfirm({ action: () => ban(id), title: "Suspend User", message: "This user will lose access.", danger: true })}
                onActivate={activate}
                onDelete={(id) => setConfirm({ action: () => remove(id), title: "Delete User", message: "This action cannot be undone.", danger: true })}
                onChangeRole={changeRole}
              />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-2">
            <Users size={24} className="text-subtle" />
            <p className="text-sm text-muted">No users found</p>
          </div>
        )}
      </div>
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}
    </div>
  );
}

const categoryConfig = {
  Cardio:   { icon: Heart,    color: "#ef4444", bg: "bg-red-500/15"    },
  Strength: { icon: Dumbbell, color: "#f97316", bg: "bg-primary/15" },
  HIIT:     { icon: Zap,      color: "#eab308", bg: "bg-yellow-500/15" },
  Yoga:     { icon: Leaf,     color: "#22c55e", bg: "bg-green-500/15"  },
};

const initialExercises = [
  { id: 1, name: "Treadmill Run",    category: "Cardio",   level: "Beginner",     duration: "30 min", status: "active" },
  { id: 2, name: "Barbell Squat",    category: "Strength", level: "Beginner",     duration: "30 min", status: "active" },
  { id: 3, name: "Burpees",          category: "HIIT",     level: "Beginner",     duration: "30 min", status: "active" },
  { id: 4, name: "Sun Salutation",   category: "Yoga",     level: "Beginner",     duration: "30 min", status: "active" },
  { id: 5, name: "Box Jump",         category: "HIIT",     level: "Intermediate", duration: "30 min", status: "active" },
  { id: 6, name: "Bench Press",      category: "Strength", level: "Intermediate", duration: "35 min", status: "active" },
  { id: 7, name: "Cycling Sprint",   category: "Cardio",   level: "Intermediate", duration: "45 min", status: "active" },
  { id: 8, name: "Warrior Sequence", category: "Yoga",     level: "Beginner",     duration: "25 min", status: "active" },
];

function ExerciseModal({ exercise, onSave, onClose }) {
  const [form, setForm] = useState(
    exercise || { name: "", category: "Cardio", level: "Beginner", duration: "30 min", status: "active", img: "" }
  );
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => set("img", e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => readFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-foreground">{exercise ? "Edit Exercise" : "Add Exercise"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-overlay/10 flex items-center justify-center hover:bg-overlay/20 transition-colors">
            <X size={15} className="text-muted" />
          </button>
        </div>

        {/* Image upload */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider">Exercise Image</label>
          <div className="mt-1.5">
            {form.img ? (
              /* Preview */
              <div className="relative rounded-2xl overflow-hidden border border-border/10 group">
                <img src={form.img} alt="preview" className="w-full h-44 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    className="flex items-center gap-1.5 bg-overlay/10 hover:bg-overlay/20 border border-border/20 text-foreground text-xs font-bold px-3 py-2 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <Upload size={12} /> Change
                  </button>
                  <button
                    type="button"
                    onClick={() => set("img", "")}
                    className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-2 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              /* Drop zone */
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                  dragOver
                    ? "border-primary/60 bg-primary/10"
                    : "border-border/10 bg-overlay/5 hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ImagePlus size={18} className="text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground/80">Click or drag & drop to upload</p>
                  <p className="text-[10px] text-subtle mt-0.5">PNG, JPG, WEBP — max 5MB</p>
                </div>
              </button>
            )}
            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Name & Duration */}
        {[
          { key: "name",     label: "Exercise Name", placeholder: "e.g. Pull-ups"  },
          { key: "duration", label: "Duration",       placeholder: "e.g. 30 min"    },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">{label}</label>
            <input
              type="text"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
            />
          </div>
        ))}

        {/* Category & Level */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all">
              {Object.keys(categoryConfig).map((c) => <option key={c} className="bg-elevated">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Level</label>
            <select value={form.level} onChange={(e) => set("level", e.target.value)}
              className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all">
              {["Beginner", "Intermediate", "Advanced"].map((l) => <option key={l} className="bg-elevated">{l}</option>)}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            disabled={!form.name.trim()}
            className="flex-1 py-3 bg-primary hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl text-sm font-bold text-foreground transition-colors"
          >
            {exercise ? "Save Changes" : "Add Exercise"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentTab() {
  const [exercises, setExercises] = useState(initialExercises);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState(null);

  const saveExercise = (form) => {
    if (modal === "add") setExercises((p) => [...p, { ...form, id: Date.now() }]);
    else setExercises((p) => p.map((e) => e.id === form.id ? form : e));
  };
  const remove = (id) => setExercises((p) => p.filter((e) => e.id !== id));
  const toggleStatus = (id) => setExercises((p) => p.map((e) => e.id === id ? { ...e, status: e.status === "active" ? "inactive" : "active" } : e));

  const filtered = exercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "All" || e.category === catFilter;
    return matchSearch && matchCat;
  });

  const levelColor = { Beginner: "green", Intermediate: "yellow", Advanced: "red" };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(categoryConfig).map(([cat, cfg]) => {
          const Icon = cfg.icon;
          const count = exercises.filter((e) => e.category === cat).length;
          return (
            <div key={cat} className="bg-overlay/5 border border-border/10 rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                <Icon size={18} style={{ color: cfg.color }} />
              </div>
              <div><p className="text-xl font-black text-foreground">{count}</p><p className="text-xs text-muted">{cat}</p></div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exercises..."
            className="w-full pl-9 pr-4 py-2.5 bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all" />
        </div>
        <div className="flex gap-5 border-b border-border/10">
          {["All", ...Object.keys(categoryConfig)].map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`pb-2 text-sm font-semibold border-b-2 -mb-px transition-all ${catFilter === c ? "text-primary border-primary" : "text-muted border-transparent hover:text-foreground/80"}`}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setModal("add")} className="flex items-center gap-2 bg-primary hover:bg-primary text-foreground text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ml-auto shrink-0">
          <Plus size={15} /> Add Exercise
        </button>
      </div>
      <div className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border/10 bg-overlay/5">
              {["Exercise", "Category", "Level", "Duration", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-black text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ex) => {
              const cfg  = categoryConfig[ex.category];
              const Icon = cfg?.icon || Dumbbell;
              return (
                <tr key={ex.id} className="border-b border-border/10 hover:bg-overlay/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {ex.img
                        ? <img src={ex.img} alt={ex.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                        : <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cfg?.bg}`}><Icon size={14} style={{ color: cfg?.color }} /></div>
                      }
                      <span className="text-sm font-bold text-foreground">{ex.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><Badge label={ex.category} color={ex.category === "Cardio" ? "red" : ex.category === "Strength" ? "orange" : ex.category === "HIIT" ? "yellow" : "green"} /></td>
                  <td className="px-5 py-3.5"><Badge label={ex.level} color={levelColor[ex.level]} /></td>
                  <td className="px-5 py-3.5 text-xs text-muted">{ex.duration}</td>
                  <td className="px-5 py-3.5"><button onClick={() => toggleStatus(ex.id)}><Badge label={ex.status} color={ex.status === "active" ? "green" : "gray"} /></button></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal(ex)} className="w-8 h-8 rounded-full bg-overlay/10 hover:bg-primary/15 flex items-center justify-center transition-colors"><Pencil size={13} className="text-muted" /></button>
                      <button onClick={() => remove(ex.id)} className="w-8 h-8 rounded-full bg-overlay/10 hover:bg-red-500/15 flex items-center justify-center transition-colors"><Trash2 size={13} className="text-muted" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modal && <ExerciseModal exercise={modal === "add" ? null : modal} onSave={saveExercise} onClose={() => setModal(null)} />}
    </div>
  );
}

const tabs = [
  { id: "users",   label: "Users",            icon: Users    },
  { id: "content", label: "Exercise Library", icon: Dumbbell },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");
  return (
    <div className="min-h-full bg-surface overflow-y-auto">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center"><Shield size={20} className="text-foreground" /></div>
            <div><h1 className="text-xl font-black text-foreground">Admin Panel</h1><p className="text-sm text-muted">Platform management</p></div>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2">
            <Crown size={14} className="text-primary" />
            <span className="text-xs font-black text-primary">Administrator</span>
          </div>
        </div>
        <div className="flex gap-6 border-b border-border/10">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
                activeTab === t.id
                  ? "text-primary border-primary"
                  : "text-muted border-transparent hover:text-foreground/80"
              }`}>
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === "users"   && <UsersTab />}
        {activeTab === "content" && <ContentTab />}
      </div>
    </div>
  );
}
