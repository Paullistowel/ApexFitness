import { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../components/dashboard/AppSidebar";
import AppNavbar from "../components/Shared/AppNavbar";
import { useIsMobile } from "../hooks/use-mobile";

export const SidebarCtx = createContext({ collapsed: false, isMobile: false, toggle: () => {} });
export const useSidebarCtx = () => useContext(SidebarCtx);

export default function DashboardLayout() {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse when switching to mobile
  useEffect(() => {
    if (isMobile) setCollapsed(true);
    else setCollapsed(false);
  }, [isMobile]);

  const toggle = () => setCollapsed((p) => !p);

  return (
    <SidebarCtx.Provider value={{ collapsed, isMobile, toggle }}>
      <div className="flex flex-col h-screen bg-surface overflow-hidden">
        <AppNavbar />

        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          <AppSidebar />

          {/* Mobile backdrop — closes sidebar on outside click */}
          {isMobile && !collapsed && (
            <div
              className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm"
              onClick={toggle}
            />
          )}

          <main className="flex-1 overflow-y-auto bg-surface">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarCtx.Provider>
  );
}
