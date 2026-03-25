import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  LayoutDashboard,
  Dumbbell,
  Salad,
  MessageCircle,
  Bell,
  User,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  CalendarDays,
  ClipboardList,
  Droplets,
  Settings,
  Shield,
  TrendingUp,
  History,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import { useSidebarCtx } from "../../layouts/DashboardLayout";

// ─── Nav config ───────────────────────────────────────────────────────────────
const navSections = [
  {
    label: "MAIN",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "TRAINING",
    items: [
      { icon: Dumbbell,     label: "Workouts",        href: "/workouts"         },
      { icon: CalendarDays, label: "Workout Plan",    href: "/workouts/plan"    },
      { icon: History,      label: "Workout History", href: "/workouts/history" },
      { icon: TrendingUp,   label: "Progress",        href: "/progress"         },
    ],
  },
  {
    label: "NUTRITION",
    items: [
      {
        icon: Salad,
        label: "Diet & Nutrition",
        expandable: true,
        baseHref: "/nutrition",
        sub: [
          { icon: ClipboardList, label: "Diet Plan",     href: "/diet"                },
          { icon: ClipboardList, label: "Log Meal",      href: "/nutrition/log-meal"  },
          { icon: Droplets,      label: "Water Tracker", href: "/nutrition/water"     },
        ],
      },
    ],
  },
  {
    label: "COMMUNITY",
    items: [
      { icon: MessageCircle, label: "AI Coach", href: "/trainer" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { icon: Bell,   label: "Notifications", href: "/notifications" },
      { icon: User,   label: "Profile",       href: "/profile"       },
      { icon: Shield, label: "Admin Panel",   href: "/admin", adminOnly: true },
    ],
  },
];

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { collapsed, isMobile, toggle } = useSidebarCtx();
  const user = useAuthStore((s) => s.user);
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const [open, setOpen] = useState({
    "Diet & Nutrition": pathname.startsWith("/nutrition"),
  });
  const toggleOpen = (label) => setOpen((p) => ({ ...p, [label]: !p[label] }));

  // On mobile: sidebar slides in/out over content (fixed). On desktop: takes layout space.
  const sidebarWidth = collapsed ? (isMobile ? "w-0" : "w-16") : "w-56";

  return (
    // Wrapper is relative so the toggle tab can be positioned outside
    <div className={`relative shrink-0 flex ${isMobile ? "absolute inset-y-0 left-0 z-20" : ""}`}>

      {/* ── Sidebar panel ── */}
      <aside
        className={`flex flex-col bg-elevated border-r border-border/10 transition-all duration-300 overflow-hidden ${sidebarWidth}`}
      >
        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label} className="mb-1">
              {!collapsed && (
                <p className="text-[10px] font-bold text-muted tracking-widest px-4 py-1.5 mt-1">
                  {section.label}
                </p>
              )}

              {section.items.filter((item) => !item.adminOnly || user?.role === "admin").map((item) => {
                const isActive = item.expandable
                  ? pathname.startsWith(item.baseHref)
                  : pathname === item.href;

                if (item.expandable) {
                  return (
                    <Collapsible
                      key={item.label}
                      open={!collapsed && open[item.label]}
                      onOpenChange={() => !collapsed && toggleOpen(item.label)}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          title={collapsed ? item.label : undefined}
                          className={`w-full flex items-center gap-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "border-l-2 border-primary bg-primary/10 text-primary pl-[14px] pr-4"
                              : "border-l-2 border-transparent text-muted hover:text-foreground hover:bg-overlay/5 pl-[14px] pr-4"
                          }`}
                        >
                          <item.icon size={18} className="shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left">{item.label}</span>
                              {open[item.label]
                                ? <ChevronDown size={14} />
                                : <ChevronRight size={14} />
                              }
                            </>
                          )}
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="ml-6 border-l border-border/10 pl-3 mb-1">
                          {item.sub.map((s) => (
                            <Link
                              key={s.label}
                              to={s.href}
                              className={`flex items-center gap-2 py-1.5 text-xs transition-colors ${
                                pathname === s.href
                                  ? "text-primary font-semibold"
                                  : "text-muted hover:text-gray-200"
                              }`}
                            >
                              <s.icon size={13} />
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-l-2 border-primary bg-primary/10 text-primary pl-[14px] pr-4"
                        : "border-l-2 border-transparent text-muted hover:text-foreground hover:bg-overlay/5 pl-[14px] pr-4"
                    }`}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User chip */}
        {!collapsed && (
          <div className="m-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-foreground text-xs font-bold shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">{user?.name ?? "User"}</p>
                <p className="text-[10px] text-primary capitalize">{user?.plan ?? "free"} Member</p>
              </div>
              <Link
                to="/profile"
                title="Settings"
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-overlay/10 transition-colors"
              >
                <Settings size={14} />
              </Link>
            </div>
          </div>
        )}

        {collapsed && !isMobile && (
          <div className="flex justify-center pb-3">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-foreground text-xs font-bold">
                {initials}
              </div>
            )}
          </div>
        )}
      </aside>

      {/* ── Toggle tab — hangs off the right edge of the sidebar ── */}
      <button
        onClick={toggle}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-6 -right-4 z-30 w-4 h-10 bg-elevated border border-border/10 border-l-0 rounded-r-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-overlay/10 transition-colors shadow-md"
      >
        <ChevronLeft
          size={12}
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
