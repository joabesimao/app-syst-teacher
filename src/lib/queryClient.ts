import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import { focusManager, QueryClient } from "@tanstack/react-query";
import { getSession, onSessionChange } from "../services/apiClient";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: 1,
    },
  },
});

if (Platform.OS !== "web") {
  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener("change", (status: AppStateStatus) =>
      handleFocus(status === "active")
    );
    return () => subscription.remove();
  });
}

let currentUserId = getSession()?.user.id;

onSessionChange((session) => {
  const userId = session?.user.id;
  if (userId !== currentUserId) queryClient.clear();
  currentUserId = userId;
});
