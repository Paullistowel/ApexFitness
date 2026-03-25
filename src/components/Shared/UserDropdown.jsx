import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const navigate        = useNavigate();
  const menuRef         = useRef(null);
  const { user, logout } = useAuthStore();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const go = (path) => { navigate(path); setOpen(false); };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 hover:bg-overlay/5 rounded-xl px-1.5 sm:px-2 py-1.5 transition-colors"
      >
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-foreground text-xs font-bold shrink-0">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-foreground leading-none">{user?.name?.split(" ")[0] ?? "User"}</p>
          <p className="text-[10px] text-muted mt-0.5 capitalize">{user?.plan ?? "free"} Member</p>
        </div>
        <ChevronDown
          size={13}
          className={`hidden sm:block text-muted ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 text-foreground">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-border/10">
            <div className="flex items-center gap-2.5">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-foreground text-sm font-bold shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{user?.name ?? "User"}</p>
                <p className="text-[10px] text-primary font-semibold capitalize">{user?.plan ?? "free"} Member</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1">
            <button
              onClick={() => go("/profile")}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:bg-overlay/10 hover:text-foreground rounded-lg transition-colors cursor-pointer"
            >
              <User size={14} className="text-muted shrink-0" />
              Profile
            </button>
            <button
              onClick={() => go("/settings")}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:bg-overlay/10 hover:text-foreground rounded-lg transition-colors cursor-pointer"
            >
              <Settings size={14} className="text-muted shrink-0" />
              Settings
            </button>
          </div>

          {/* Log out */}
          <div className="border-t border-border/10 p-1">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={14} className="shrink-0" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
