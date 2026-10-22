import Ionicons from "@expo/vector-icons/Ionicons";
import { Drawer } from "expo-router/drawer";
import { DrawerMenu } from "@/features/auth";
import { colors } from "@/shared/theme";

const screenOptions = {
  headerTintColor: colors.primary,
  headerTitleStyle: { color: colors.text },
  sceneStyle: { backgroundColor: colors.background },
  drawerType: "front" as const,
  swipeEnabled: true,
  drawerActiveTintColor: colors.primary,
  drawerActiveBackgroundColor: colors.infoSoft,
  drawerInactiveTintColor: colors.text,
  overlayColor: colors.overlay,
};

export default function MenuLayout() {
  return (
    <Drawer drawerContent={(props) => <DrawerMenu {...props} />} screenOptions={screenOptions}>
      <Drawer.Screen
        name="index"
        options={{
          title: "Painel",
          drawerIcon: ({ color, size }) => <Ionicons name="stats-chart" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="turmas"
        options={{
          title: "Minhas turmas",
          drawerIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
        }}
      />
    </Drawer>
  );
}
