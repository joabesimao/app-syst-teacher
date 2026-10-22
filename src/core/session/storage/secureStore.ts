import * as SecureStore from "expo-secure-store";
import type { Session, SessionStorage } from "../types";

const STORAGE_KEY = "syst-teacher.session";

export const sessionStorage: SessionStorage = {
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
