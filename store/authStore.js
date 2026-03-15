import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api";
import toast from "react-hot-toast";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("luxe_token", token);
          document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }
        set({ user, token });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("luxe_token");
          localStorage.removeItem("luxe_user");
          document.cookie = "token=; path=/; max-age=0";
        }
        set({ user: null, token: null });
        toast.success("Logged out successfully");
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register(data);
          get().setAuth(res.data.user, res.data.token);
          toast.success("Welcome to LuxeWear!");
          return { success: true };
        } catch (err) {
          toast.error(err.response?.data?.message || "Registration failed");
          return { success: false };
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login(data);
          get().setAuth(res.data.user, res.data.token);
          toast.success(`Welcome back, ${res.data.user.name}!`);
          return { success: true };
        } catch (err) {
          toast.error(err.response?.data?.message || "Login failed");
          return { success: false };
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        try {
          const res = await authApi.updateProfile(data);
          set({ user: res.data.user });
          toast.success("Profile updated");
          return { success: true };
        } catch (err) {
          toast.error(err.response?.data?.message || "Update failed");
          return { success: false };
        }
      },

      refreshUser: async () => {
        try {
          const res = await authApi.getMe();
          set({ user: res.data.user });
        } catch {
          get().logout();
        }
      },

      isAdmin: () => get().user?.role === "admin",
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "luxe_auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);

export default useAuthStore;
