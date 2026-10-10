import type { Session, SessionStore } from "./apiClient";

const STORAGE_KEY = "syst-teacher:session";

export const sessionStore: SessionStore = {
  load: async () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  },
  save: async (session) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },
  clear: async () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
