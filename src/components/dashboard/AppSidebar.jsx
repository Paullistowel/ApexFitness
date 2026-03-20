import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  Salad,
  MessageCircle,
  Bell,
  User,
  Settings,
  ChevronRight,
  ChevronDown,
  Play,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Droplets,
  Flame,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import ApexLogo from "../../Assets/ApexFitness.logo.png";
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
      {
        icon: Dumbbell,
        label: "Workouts",
        expandable: true,
        baseHref: "/workouts",
        sub: [
          { icon: Play,         label: "Start Workout",   href: "/workouts/start"   },
          { icon: BookOpen,     label: "Workout Library", href: "/workouts/library" },
          { icon: CalendarDays, label: "Workout Plan",    href: "/workouts/plan"    },
        ],
      },
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
          { icon: ClipboardList, label: "Diet Plan",     href: "/nutrition/diet-plan" },
          { icon: ClipboardList, label: "Log Meal",      href: "/nutrition/log-meal"  },
          { icon: Droplets,      label: "Water Tracker", href: "/nutrition/water"     },
        ],
      },
    ],
  },
  {
    label: "COMMUNITY",
    items: [
      { icon: MessageCircle, label: "Chat with Trainer", href: "/trainer" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { icon: Bell,     label: "Notifications", href: "/notifications" },
      { icon: User,     label: "Profile",       href: "/profile"       },
      { icon: Settings, label: "Settings",      href: "/settings"      },
    ],
  },
];

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { collapsed } = useSidebarCtx();

  // track open state per expandable section
  const [open, setOpen] = useState({
    Workouts: pathname.startsWith("/workouts"),
    "Diet & Nutrition": pathname.startsWith("/nutrition"),
  });

  const toggleOpen = (label) =>
    setOpen((p) => ({ ...p, [label]: !p[label] }));

  return (
    <aside
      className={`flex flex-col shrink-0 bg-[#1d1a17] border-r border-white/10 transition-all duration-300 overflow-y-auto ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-white/10 h-[4.5rem] overflow-hidden px-2">
        {collapsed ? (
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
            <Flame size={16} className="text-white" />
          </div>
        ) : (
          <img src={ApexLogo} alt="Apex Fitness" className="h-[80px] w-auto" />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-1">
            {!collapsed && (
              <p className="text-[10px] font-bold text-gray-600 tracking-widest px-4 py-1">
                {section.label}
              </p>
            )}

            {section.items.map((item) => {
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
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "text-orange-500 bg-orange-500/10"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon size={18} className="shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {open[item.label] ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </>
                        )}
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="ml-6 border-l border-white/10 pl-3 mb-1">
                        {item.sub.map((s) => (
                          <Link
                            key={s.label}
                            to={s.href}
                            className={`flex items-center gap-2 py-1.5 text-xs transition-colors ${
                              pathname === s.href
                                ? "text-orange-400 font-semibold"
                                : "text-gray-500 hover:text-gray-200"
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
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-orange-500 bg-orange-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
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
      {!collapsed ? (
        <div className="m-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              EA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Emmanuel Acquah</p>
              <p className="text-[10px] text-orange-400">Pro Member · Weight Loss</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center pb-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
            EA
          </div>
        </div>
      )}
    </aside>
  );
}
