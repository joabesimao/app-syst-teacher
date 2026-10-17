import { create } from "zustand";
import {
  login as loginRequest,
  logout as logoutRequest,
  onSessionChange,
  restoreSession,
} from "../services/apiClient";
import type { SessionUser } from "../services/apiClient";

type AuthStatus = "restoring" | "authenticated" | "anonymous";

interface AuthState {
  status: AuthStatus;
  user?: SessionUser;
  restore: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "restoring",
  user: undefined,

  restore: async () => {
    const session = await restoreSession();
    set({ status: session ? "authenticated" : "anonymous", user: session?.user });
  },

  login: async (email, password) => {
    await loginRequest(email, password);
  },

  logout: async () => {
    await logoutRequest();
  },
}));

onSessionChange((session) => {
  useAuthStore.setState({
    status: session ? "authenticated" : "anonymous",
    user: session?.user,
  });
});
