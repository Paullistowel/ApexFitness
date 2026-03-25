import { create } from "zustand";
import api from "../lib/api";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("apex-token", data.accessToken);
      set({ user: data.user, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("apex-token", data.accessToken);
      set({ user: data.user, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("apex-token");
      set({ user: null });
      window.location.href = "/auth";
    }
  },

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
