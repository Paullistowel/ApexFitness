import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../components/dashboard/AppSidebar";
import AppNavbar from "../components/Shared/AppNavbar";

export const SidebarCtx = createContext({ collapsed: false, toggle: () => {} });
export const useSidebarCtx = () => useContext(SidebarCtx);

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((p) => !p);

  return (
    <SidebarCtx.Provider value={{ collapsed, toggle }}>
      <div className="flex h-screen bg-[#1a0f08] overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AppNavbar />
          <main className="flex-1 overflow-y-auto bg-[#1a0f08]">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarCtx.Provider>
  );
}
