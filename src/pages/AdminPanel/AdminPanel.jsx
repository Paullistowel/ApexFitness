import { useState, useRef } from "react";
import {
  Users, Dumbbell, Search, MoreVertical, Ban, CheckCircle2,
  Trash2, Plus, Pencil, X, Shield, Crown,
  Zap, Leaf, Heart, ImagePlus, Upload, Bell, Send, CheckCheck,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name) {
  return (name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function formatJoined(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
const COLORS = ["#f97316","#3b82f6","#a855f7","#22c55e","#ef4444","#eab308","#06b6d4","#ec4899"];
function avatarColor(name) { return COLORS[(name || "").charCodeAt(0) % COLORS.length]; }

// ─── Sub-components ───────────────────────────────────────────────────────────
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
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${colors[color] || colors.gray}`}>{label}</span>;
}

function Avatar({ name, size = "md" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm" };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-black text-foreground shrink-0`}
      style={{ backgroundColor: avatarColor(name) }}>
      {initials(name)}
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
            className={`flex-1 py-3 rounded-2xl text-sm font-bold text-foreground transition-colors ${danger ? "bg-red-500 hover:bg-red-600" : "bg-primary"}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UserRow({ user, onBan, onActivate, onDelete, onChangeRole }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusColor = { active: "green", suspended: "red", banned: "gray" };
  const planColor   = { pro: "orange", free: "blue" };
  const roleColor   = { user: "gray", admin: "orange" };

  return (
    <tr className="border-b border-border/10 hover:bg-overlay/5 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div>
            <p className="text-sm font-bold text-foreground">{user.name}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5"><Badge label={user.role}   color={roleColor[user.role]            ?? "gray"}  /></td>
      <td className="px-4 py-3.5"><Badge label={user.plan}   color={planColor[user.plan]            ?? "gray"}  /></td>
      <td className="px-4 py-3.5"><Badge label={user.status} color={statusColor[user.status]        ?? "gray"}  /></td>
      <td className="px-4 py-3.5 text-xs text-muted">{formatJoined(user.created_at)}</td>
      <td className="px-4 py-3.5 relative">
        <button onClick={() => setMenuOpen((p) => !p)}
          className="w-8 h-8 rounded-full hover:bg-overlay/10 flex items-center justify-center transition-colors">
          <MoreVertical size={15} className="text-muted" />
        </button>
        {menuOpen && (
          <div className="absolute right-4 bottom-10 bg-elevated border border-border/10 rounded-2xl shadow-xl z-20 py-1 min-w-[160px]">
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
            <button onClick={() => { onChangeRole(user.id, user.role); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-foreground/80 hover:bg-overlay/5 transition-colors">
              <Shield size={13} /> {user.role === "admin" ? "Remove Admin" : "Make Admin"}
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
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", search, filter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter !== "all") params.set("filter", filter);
      return api.get(`/admin/users?${params}`).then((r) => r.data);
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/admin/users/${id}/status`, { status }),
    onSuccess: invalidate,
  });
  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: invalidate,
  });

  const stats = [
    { label: "Total Users", value: users.length,                                    color: "#f97316" },
    { label: "Pro Members", value: users.filter((u) => u.plan === "pro").length,    color: "#22c55e" },
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

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
        <div className="flex gap-6 border-b border-border/10">
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
              {["User", "Role", "Plan", "Status", "Joined", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-black text-muted uppercase tracking-wider first:px-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="py-12 text-center">
                <div className="flex justify-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
              </td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-sm text-muted">No users found</td></tr>
            ) : users.map((u) => (
              <UserRow key={u.id} user={u}
                onBan={(id) => setConfirm({ onConfirm: () => statusMutation.mutate({ id, status: "suspended" }), title: "Suspend User", message: "This user will lose access.", danger: true })}
                onActivate={(id) => statusMutation.mutate({ id, status: "active" })}
                onDelete={(id) => setConfirm({ onConfirm: () => deleteMutation.mutate(id), title: "Delete User", message: "This action cannot be undone.", danger: true })}
                onChangeRole={(id, role) => roleMutation.mutate({ id, role: role === "admin" ? "user" : "admin" })}
              />
            ))}
          </tbody>
        </table>
      </div>
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Exercise Tab ─────────────────────────────────────────────────────────────
const categoryConfig = {
  Strength:    { icon: Dumbbell, color: "#f97316", bg: "bg-primary/15"    },
  Cardio:      { icon: Heart,    color: "#ef4444", bg: "bg-red-500/15"    },
  HIIT:        { icon: Zap,      color: "#eab308", bg: "bg-yellow-500/15" },
  Flexibility: { icon: Leaf,     color: "#22c55e", bg: "bg-green-500/15"  },
};

function ExerciseModal({ exercise, onSave, onClose }) {
  const [form, setForm] = useState(
    exercise
      ? { name: exercise.name, category: exercise.category, difficulty: exercise.difficulty, duration_mins: exercise.duration_mins ?? 30, duration_secs: exercise.duration_secs ?? 45, img_url: exercise.img_url ?? "" }
      : { name: "", category: "Strength", difficulty: "beginner", duration_mins: 30, duration_secs: 45, img_url: "" }
  );
  const [dragOver,    setDragOver]    = useState(false);
  const [preview,     setPreview]     = useState(exercise?.img_url ? `${import.meta.env.VITE_BACKEND_URL}${exercise.img_url}` : "");
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef(null);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadError("");
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await api.post("/admin/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set("img_url", res.data.url);
      setPreview(`${import.meta.env.VITE_BACKEND_URL}${res.data.url}`);
    } catch {
      setUploadError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-elevated border border-border/10 rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
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
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden border border-border/10 group">
                <img src={preview} alt="preview" className="w-full h-44 object-cover" />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button type="button" onClick={() => fileRef.current.click()}
                    className="flex items-center gap-1.5 bg-overlay/10 border border-border/20 text-foreground text-xs font-bold px-3 py-2 rounded-xl backdrop-blur-sm">
                    <Upload size={12} /> Change
                  </button>
                  <button type="button" onClick={() => { setPreview(""); set("img_url", ""); }}
                    className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-2 rounded-xl backdrop-blur-sm">
                    <X size={12} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFile(e.dataTransfer.files[0]); }}
                disabled={uploading}
                className={`w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${dragOver ? "border-primary/60 bg-primary/10" : "border-border/10 bg-overlay/5 hover:border-primary/30"}`}>
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {uploading
                    ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    : <ImagePlus size={18} className="text-primary" />
                  }
                </div>
                <p className="text-xs font-bold text-foreground/80">{uploading ? "Uploading…" : "Click or drag & drop"}</p>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadFile(e.target.files[0])} />
            {uploadError && <p className="text-xs text-red-400 mt-1">{uploadError}</p>}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider">Exercise Name</label>
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Pull-ups"
            className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>

        {/* Duration fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Session Duration (mins)</label>
            <input type="number" min={1} value={form.duration_mins} onChange={(e) => set("duration_mins", Number(e.target.value))}
              className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Timer per Set (secs)</label>
            <input type="number" min={5} max={300} value={form.duration_secs} onChange={(e) => set("duration_secs", Number(e.target.value))}
              className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
              {Object.keys(categoryConfig).map((c) => <option key={c} className="bg-elevated">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Difficulty</label>
            <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}
              className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
              {["beginner", "intermediate", "advanced"].map((l) => <option key={l} className="bg-elevated capitalize">{l}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-3 border border-border/10 rounded-2xl text-sm font-semibold text-muted hover:bg-overlay/5 transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} disabled={!form.name.trim() || uploading}
            className="flex-1 py-3 bg-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl text-sm font-bold text-foreground transition-colors">
            {exercise ? "Save Changes" : "Add Exercise"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentTab() {
  const queryClient = useQueryClient();
  const [search, setSearch]   = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal]     = useState(null);

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ["admin-exercises", search, catFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (catFilter !== "All") params.set("category", catFilter);
      return api.get(`/admin/exercises?${params}`).then((r) => r.data);
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-exercises"] });

  const createMutation = useMutation({
    mutationFn: (form) => api.post("/admin/exercises", form),
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...form }) => api.put(`/admin/exercises/${id}`, form),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/exercises/${id}`),
    onSuccess: invalidate,
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/admin/exercises/${id}/status`, { status }),
    onSuccess: invalidate,
  });

  const saveExercise = (form) => {
    if (modal === "add") createMutation.mutate(form);
    else updateMutation.mutate({ id: modal.id, ...form });
  };

  const levelColor = { beginner: "green", intermediate: "yellow", advanced: "red" };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(categoryConfig).map(([cat, cfg]) => {
          const Icon  = cfg.icon;
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

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exercises..."
            className="w-full pl-9 pr-4 py-2.5 bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
        <div className="flex gap-5 border-b border-border/10">
          {["All", ...Object.keys(categoryConfig)].map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`pb-2 text-sm font-semibold border-b-2 -mb-px transition-all ${catFilter === c ? "text-primary border-primary" : "text-muted border-transparent hover:text-foreground/80"}`}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setModal("add")} className="flex items-center gap-2 bg-primary text-foreground text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ml-auto shrink-0">
          <Plus size={15} /> Add Exercise
        </button>
      </div>

      <div className="bg-overlay/5 border border-border/10 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border/10 bg-overlay/5">
              {["Exercise", "Category", "Difficulty", "Duration", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-black text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="py-12 text-center">
                <div className="flex justify-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
              </td></tr>
            ) : exercises.map((ex) => {
              const cfg  = categoryConfig[ex.category];
              const Icon = cfg?.icon || Dumbbell;
              return (
                <tr key={ex.id} className="border-b border-border/10 hover:bg-overlay/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {ex.img_url
                        ? <img src={ex.img_url.startsWith("http") ? ex.img_url : `${import.meta.env.VITE_BACKEND_URL}${ex.img_url}`} alt={ex.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                        : <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cfg?.bg}`}><Icon size={14} style={{ color: cfg?.color }} /></div>
                      }
                      <span className="text-sm font-bold text-foreground">{ex.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><Badge label={ex.category}   color={ex.category === "Cardio" ? "red" : ex.category === "Strength" ? "orange" : ex.category === "HIIT" ? "yellow" : "green"} /></td>
                  <td className="px-5 py-3.5"><Badge label={ex.difficulty} color={levelColor[ex.difficulty] ?? "gray"} /></td>
                  <td className="px-5 py-3.5 text-xs text-muted">{ex.duration_mins ? `${ex.duration_mins} min` : "—"}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => statusMutation.mutate({ id: ex.id, status: ex.status === "active" ? "inactive" : "active" })}>
                      <Badge label={ex.status} color={ex.status === "active" ? "green" : "gray"} />
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal(ex)} className="w-8 h-8 rounded-full bg-overlay/10 hover:bg-primary/15 flex items-center justify-center transition-colors"><Pencil size={13} className="text-muted" /></button>
                      <button onClick={() => deleteMutation.mutate(ex.id)} className="w-8 h-8 rounded-full bg-overlay/10 hover:bg-red-500/15 flex items-center justify-center transition-colors"><Trash2 size={13} className="text-muted" /></button>
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

// ─── Notifications Tab ────────────────────────────────────────────────────────
const NOTIF_TYPES = ["workout", "diet", "water", "achievement", "message", "system"];
const TYPE_COLORS = {
  workout:     "text-primary bg-primary/10 border-primary/20",
  diet:        "text-green-400 bg-green-500/10 border-green-500/20",
  water:       "text-blue-400 bg-blue-500/10 border-blue-500/20",
  achievement: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  message:     "text-purple-400 bg-purple-500/10 border-purple-500/20",
  system:      "text-muted bg-overlay/10 border-border/10",
};

function NotificationsTab() {
  const [form, setForm]       = useState({ title: "", body: "", type: "system", target: "all" });
  const [sent, setSent]       = useState(null); // { count } after success
  const [error, setError]     = useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const { data: allUsers = [] } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: () => api.get("/admin/users").then((r) => r.data),
  });

  const sendMutation = useMutation({
    mutationFn: (payload) => api.post("/admin/notifications/send", payload),
    onSuccess: (res) => {
      setSent(res.data.sent);
      setError("");
      setForm({ title: "", body: "", type: "system", target: "all" });
    },
    onError: () => setError("Failed to send. Please try again."),
  });

  const handleSend = () => {
    if (!form.title.trim() || !form.body.trim()) {
      setError("Title and message are required.");
      return;
    }
    setSent(null);
    setError("");
    sendMutation.mutate(form);
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Info strip */}
      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Bell size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Send Notification</p>
          <p className="text-xs text-muted">Broadcast to all users or target a specific one. Appears in their notification bell.</p>
        </div>
      </div>

      <div className="bg-overlay/5 border border-border/10 rounded-2xl p-5 space-y-4">
        {/* Type */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider">Type</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {NOTIF_TYPES.map((t) => (
              <button key={t} onClick={() => set("type", t)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize transition-all ${
                  form.type === t ? TYPE_COLORS[t] : "bg-overlay/5 border-border/10 text-muted hover:text-foreground/80"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Target */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider">Recipient</label>
          <div className="flex gap-3 mt-2">
            <button onClick={() => set("target", "all")}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                form.target === "all" ? "bg-primary/10 border-primary/30 text-primary" : "bg-overlay/5 border-border/10 text-muted hover:text-foreground/80"
              }`}>
              All Users ({allUsers.length})
            </button>
            <button onClick={() => set("target", form.target === "all" ? "" : form.target)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                form.target !== "all" ? "bg-primary/10 border-primary/30 text-primary" : "bg-overlay/5 border-border/10 text-muted hover:text-foreground/80"
              }`}>
              Specific User
            </button>
          </div>

          {form.target !== "all" && (
            <select value={form.target} onChange={(e) => set("target", e.target.value)}
              className="mt-2 w-full bg-overlay/5 border border-border/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
              <option value="" className="bg-elevated">— Select a user —</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-elevated">{u.name} ({u.email})</option>
              ))}
            </select>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider">Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. New workout added!"
            className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>

        {/* Message */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider">Message</label>
          <textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={4}
            placeholder="Write your notification message here…"
            className="mt-1.5 w-full bg-overlay/5 border border-border/10 text-foreground placeholder:text-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        {sent !== null && (
          <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
            <CheckCheck size={16} /> Sent to {sent} user{sent !== 1 ? "s" : ""}
          </div>
        )}

        <button onClick={handleSend} disabled={sendMutation.isPending}
          className="w-full flex items-center justify-center gap-2 bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-foreground text-sm font-bold py-3 rounded-2xl transition-colors">
          {sendMutation.isPending
            ? <div className="w-4 h-4 border-2 border-foreground/40 border-t-foreground rounded-full animate-spin" />
            : <><Send size={14} /> Send Notification</>
          }
        </button>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const tabs = [
  { id: "users",   label: "Users",            icon: Users    },
  { id: "content", label: "Exercise Library", icon: Dumbbell },
  { id: "notifs",  label: "Notifications",    icon: Bell     },
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
              className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 -mb-px transition-all ${activeTab === t.id ? "text-primary border-primary" : "text-muted border-transparent hover:text-foreground/80"}`}>
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === "users"   && <UsersTab />}
        {activeTab === "content" && <ContentTab />}
        {activeTab === "notifs"  && <NotificationsTab />}
      </div>
    </div>
  );
}
