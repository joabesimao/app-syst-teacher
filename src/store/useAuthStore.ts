import { create } from "zustand";
import {
  login as loginRequest,
  logout as logoutRequest,
  onSessionChange,
  restoreSession,
} from "../services/apiClient";
import type { SessionTeacher } from "../services/apiClient";

type AuthStatus = "restoring" | "authenticated" | "anonymous";

interface AuthState {
  status: AuthStatus;
  teacher?: SessionTeacher;
  restore: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "restoring",
  teacher: undefined,

  restore: async () => {
    const session = await restoreSession();
    set({ status: session ? "authenticated" : "anonymous", teacher: session?.teacher });
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
    teacher: session?.teacher,
  });
});
