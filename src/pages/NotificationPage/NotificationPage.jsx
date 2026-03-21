import { useState } from "react";
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Dumbbell,
  Salad,
  Droplets,
  Trophy,
  MessageCircle,
  X,
} from "lucide-react";

const notifIconMap = {
  workout:     { icon: Dumbbell,      bg: "bg-primary/15", color: "text-primary" },
  diet:        { icon: Salad,         bg: "bg-green-500/15",  color: "text-green-400"  },
  water:       { icon: Droplets,      bg: "bg-blue-500/15",   color: "text-blue-400"   },
  achievement: { icon: Trophy,        bg: "bg-yellow-500/15", color: "text-yellow-400" },
  message:     { icon: MessageCircle, bg: "bg-purple-500/15", color: "text-purple-400" },
  system:      { icon: Bell,          bg: "bg-overlay/10",      color: "text-muted"   },
};

const initialNotifs = [
  { id: 1, type: "workout",     title: "New workout assigned",         body: "Coach Amara updated your Friday strength session.",        time: "2h ago",     read: false },
  { id: 2, type: "message",     title: "Coach Amara sent a message",   body: "Remember to hit your water goal today. Hydration is key!", time: "3h ago",     read: false },
  { id: 3, type: "diet",        title: "Diet plan updated",            body: "Your meal plan for Thursday has been refreshed.",          time: "5h ago",     read: false },
  { id: 4, type: "achievement", title: "Achievement unlocked 🎉",      body: "You've completed 7 workouts in a row. Keep it up!",        time: "Yesterday",  read: true  },
  { id: 5, type: "water",       title: "Hydration reminder",           body: "You haven't logged water in 2 hours. Time to sip!",       time: "Yesterday",  read: true  },
  { id: 6, type: "workout",     title: "Workout reminder",             body: "Your scheduled leg day starts in 30 minutes.",            time: "2 days ago", read: true  },
  { id: 7, type: "system",      title: "Pro plan renewing soon",       body: "Your Pro membership renews on April 1, 2026.",            time: "3 days ago", read: true  },
  { id: 8, type: "achievement", title: "New personal record!",         body: "You burned 600 kcal in a single session. New best!",      time: "4 days ago", read: true  },
];

export default function NotificationPage() {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  const markRead    = (id) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id) => setNotifs((p) => p.filter((n) => n.id !== id));
  const clearAll    = () => setNotifs([]);

  const filtered = notifs.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.read : n.type === filter
  );

  const filterTabs = [
    { id: "all",     label: "All"       },
    { id: "unread",  label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
    { id: "workout", label: "Workouts"  },
    { id: "message", label: "Messages"  },
  ];

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-2xl mx-auto p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-foreground">Notifications</h1>
            <p className="text-sm text-muted mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/15 hover:bg-primary/25 px-3 py-2 rounded-xl border border-primary/30 transition-colors"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
            {notifs.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-xs font-bold text-muted bg-overlay/5 hover:bg-overlay/10 px-3 py-2 rounded-xl border border-border/10 transition-colors"
              >
                <Trash2 size={13} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                filter === t.id
                  ? "bg-primary text-foreground border-primary shadow-md"
                  : "bg-overlay/5 text-muted border-border/10 hover:bg-overlay/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-overlay/5 flex items-center justify-center">
              <BellOff size={24} className="text-muted" />
            </div>
            <p className="text-sm font-semibold text-muted">No notifications here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => {
              const cfg  = notifIconMap[n.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all group ${
                    !n.read
                      ? "bg-overlay/5 border-primary/20"
                      : "bg-overlay/5 border-border/5 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon size={18} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-bold ${!n.read ? "text-foreground" : "text-muted"}`}>
                        {n.title}
                      </p>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] text-muted mt-1.5 font-semibold">{n.time}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-overlay/10 hover:bg-red-500/20 flex items-center justify-center transition-all shrink-0"
                  >
                    <X size={12} className="text-muted hover:text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
