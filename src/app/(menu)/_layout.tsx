import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Button } from "../../components/ui";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme";

export default function TabsLayout() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerTitleStyle: { color: colors.text },
        sceneStyle: { backgroundColor: colors.background },
        headerRight: () => <Button variant="ghost" title="Sair" onPress={() => void logout()} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Painel",
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="turmas"
        options={{
          title: "Minhas turmas",
          tabBarLabel: "Turmas",
          tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
