import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("apex-token");
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const token = localStorage.getItem("apex-token");

  if (!token) return <Navigate to="/auth" replace />;
  if (user && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
