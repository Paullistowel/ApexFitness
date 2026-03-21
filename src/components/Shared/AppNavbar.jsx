import { useState } from "react";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ApexLogo from "../../Assets/ApexFitness.logo.png";
import SearchModal from "../SearchModal/SearchModal";
import UserDropdown from "./UserDropdown";
import { useTheme } from "../../context/ThemeContext";

// ─── Navbar ────────────────────────────────────────────────────────────────────
export default function AppNavbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  return (
    <>
      <header className="h-16 bg-background flex items-center px-4 sm:px-6 gap-4 sm:gap-6 shrink-0 w-full z-20">
        {/* Logo */}
        <img src={ApexLogo} alt="Apex Fitness" className="h-[90px] w-auto shrink-0" />

        {/* Divider — hidden on mobile */}
        <div className="hidden sm:block h-6 w-px bg-overlay/10 shrink-0" />

        {/* Search trigger — desktop */}
        <button
          onClick={() => setSearchOpen(true)}
          className="relative hidden sm:flex items-center gap-2 w-64 lg:w-80 pl-9 pr-4 py-2 text-sm bg-overlay/5 border border-border/10 rounded-lg text-subtle hover:border-primary/30 hover:bg-overlay/8 transition-all"
        >
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          Search workouts…
          <kbd className="ml-auto text-[10px] font-bold bg-overlay/5 border border-border/10 rounded px-1.5 py-0.5 text-subtle">
            ⌘K
          </kbd>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search icon — mobile only */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden w-9 h-9 rounded-lg border border-border/10 bg-overlay/5 flex items-center justify-center hover:bg-overlay/10 transition-colors"
          >
            <Search size={16} className="text-muted" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-9 h-9 rounded-lg border border-border/10 bg-overlay/5 flex items-center justify-center hover:bg-overlay/10 transition-colors"
          >
            <Bell size={16} className="text-muted" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-foreground text-[10px] flex items-center justify-center font-bold leading-none">
              3
            </span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="w-9 h-9 rounded-lg border border-border/10 bg-overlay/5 flex items-center justify-center hover:bg-overlay/10 transition-colors"
          >
            {theme === "dark"
              ? <Sun size={16} className="text-muted" />
              : <Moon size={16} className="text-muted" />
            }
          </button>

          {/* Divider — hidden on mobile */}
          <div className="hidden sm:block h-6 w-px bg-overlay/10" />

          {/* User dropdown */}
          <UserDropdown />
        </div>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
