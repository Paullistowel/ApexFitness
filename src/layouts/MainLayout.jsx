import { Outlet } from "react-router-dom";
import NavBar from "../components/LandingComponent/NavBar";
import Footer from "../components/Shared/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
