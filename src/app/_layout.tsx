import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Loading } from "../components/ui";
import { queryClient } from "../lib/queryClient";
import { configureApi } from "../services/apiClient";
import { sessionStore } from "../services/sessionStore";
import { useAuthStore } from "../store/useAuthStore";
import { colors } from "../theme";

configureApi({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api",
  sessionStore,
});

export default function RootLayout() {
  const status = useAuthStore((state) => state.status);
  const restore = useAuthStore((state) => state.restore);

  useEffect(() => {
    void restore();
  }, [restore]);

  if (status === "restoring") {
    return <Loading />;
  }

  const authenticated = status === "authenticated";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <QueryClientProvider client={queryClient}>
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Protected guard={!authenticated}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={authenticated}>
          <Stack.Screen name="(menu)" options={{ headerShown: false }} />
          <Stack.Screen name="turma" options={{ title: "Turma" }} />
          <Stack.Screen name="chamada" options={{ title: "Chamada" }} />
          <Stack.Screen name="notas" options={{ title: "Lançar notas" }} />
          <Stack.Screen name="aluno" options={{ title: "Aluno" }} />
          <Stack.Screen name="avaliacao" options={{ title: "Avaliação" }} />
        </Stack.Protected>
      </Stack>
    </SafeAreaProvider>
    </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
