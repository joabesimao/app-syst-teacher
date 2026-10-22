import { create } from "zustand";
import type { AuthUser, Session } from "../../domain/models";

export type AuthStatus = "restoring" | "authenticated" | "anonymous";

interface SessionState {
  status: AuthStatus;
  user: AuthUser | null;
  setSession: (session: Session | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: "restoring",
  user: null,
  setSession: (session) =>
    set({ status: session ? "authenticated" : "anonymous", user: session?.user ?? null }),
}));
