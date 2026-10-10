import * as SecureStore from "expo-secure-store";
import type { Session, SessionStore } from "./apiClient";

const STORAGE_KEY = "syst-teacher.session";

export const sessionStore: SessionStore = {
  load: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  },
  save: async (session) => {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
  },
  clear: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  },
};
