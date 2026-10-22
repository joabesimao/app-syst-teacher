import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthBootstrap } from "@/features/auth";
import { AppProviders } from "@/main/AppProviders";
import { createContainer } from "@/main/container";
import { createQueryClient, installQueryListeners } from "@/main/queryClient";
import { colors } from "@/shared/theme";
import { Loading } from "@/shared/ui";

const dependencies = createContainer();
const queryClient = createQueryClient();
installQueryListeners();

const screenOptions = {
  headerTintColor: colors.primary,
  headerTitleStyle: { color: colors.text },
  contentStyle: { backgroundColor: colors.background },
};

function RootNavigator() {
  const status = useAuthBootstrap();
  if (status === "restoring") return <Loading />;
  const authenticated = status === "authenticated";

  return (
    <Stack screenOptions={screenOptions}>
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
  );
}

export default function RootLayout() {
  return (
    <AppProviders dependencies={dependencies} queryClient={queryClient}>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProviders>
  );
}
