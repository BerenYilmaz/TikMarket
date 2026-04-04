import { create } from "zustand";

const useAuthStore = create((set) => ({
  user:  null,
  token: null,
  isAuthenticated: false,

  // Call this after successful login or register
  setAuth: (user, token) => {
    localStorage.setItem("tikmarket_token", token);
    localStorage.setItem("tikmarket_user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  // Call this on app load to restore session
  loadAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("tikmarket_token");
      const user  = localStorage.getItem("tikmarket_user");
      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
        });
      }
    }
  },

  // Call this on logout
  logout: () => {
    localStorage.removeItem("tikmarket_token");
    localStorage.removeItem("tikmarket_user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;