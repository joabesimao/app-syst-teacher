import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Loading } from "../components/ui";
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
          <Stack.Screen name="index" options={{ title: "Minhas turmas" }} />
          <Stack.Screen name="turma" options={{ title: "Turma" }} />
          <Stack.Screen name="chamada" options={{ title: "Chamada" }} />
          <Stack.Screen name="notas" options={{ title: "Lançar notas" }} />
        </Stack.Protected>
      </Stack>
    </SafeAreaProvider>
  );
}
