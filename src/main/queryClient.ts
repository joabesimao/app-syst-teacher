import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import { focusManager, QueryClient } from "@tanstack/react-query";
import { isClientError } from "@/core/domain/errors";
import { staleTimes } from "@/shared/query/queryRoots";

const MAX_RETRIES = 2;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: staleTimes.medium,
        gcTime: 10 * 60_000,
        retry: (failureCount, error) => !isClientError(error) && failureCount < MAX_RETRIES,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let listenersInstalled = false;

export function installQueryListeners() {
  if (listenersInstalled || Platform.OS === "web") return;
  listenersInstalled = true;

  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener("change", (status: AppStateStatus) =>
      handleFocus(status === "active")
    );
    return () => subscription.remove();
  });
}
