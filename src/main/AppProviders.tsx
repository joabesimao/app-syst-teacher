import type { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { DependenciesProvider } from "./di";
import type { AppDependencies } from "./di";

interface AppProvidersProps {
  dependencies: AppDependencies;
  queryClient: QueryClient;
  children: ReactNode;
}

export function AppProviders({ dependencies, queryClient, children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DependenciesProvider value={dependencies}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>{children}</SafeAreaProvider>
        </QueryClientProvider>
      </DependenciesProvider>
    </GestureHandlerRootView>
  );
}
