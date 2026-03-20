import { Bell, ChevronDown, Search, PanelLeftClose } from "lucide-react";
import { useSidebarCtx } from "../../layouts/DashboardLayout";

export default function AppNavbar() {
  const { toggle } = useSidebarCtx();

  return (
    <header className="h-14 bg-[#1d1a17] border-b border-white/10 flex items-center px-4 gap-4 shrink-0">
      {/* Sidebar toggle */}
      <button
        onClick={toggle}
        className="text-gray-400 hover:text-white transition-colors p-1"
      >
        <PanelLeftClose size={18} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 transition-all"
          />
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
          <Bell size={16} className="text-gray-400" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            3
          </span>
        </button>

        <button className="flex items-center gap-2 border border-white/10 rounded-full pl-2 pr-3 py-1.5 hover:bg-white/5 transition-colors">
          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
            E
          </div>
          <span className="text-sm font-medium text-gray-300">Emmanuel</span>
          <ChevronDown size={13} className="text-gray-500" />
        </button>
      </div>
    </header>
  );
}
