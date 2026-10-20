import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "expo-router/drawer";
import type { DrawerContentComponentProps } from "expo-router/drawer";
import { useAuthStore } from "../store/useAuthStore";
import { colors, spacing } from "../theme";

export function DrawerMenu(props: DrawerContentComponentProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name ?? "Professor"}
            </Text>
            {user?.email ? (
              <Text style={styles.userEmail} numberOfLines={1}>
                {user.email}
              </Text>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar menu"
            hitSlop={12}
            onPress={() => props.navigation.closeDrawer()}
          >
            <Ionicons name="close" size={26} color={colors.muted} />
          </Pressable>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing(1) }]}>
        <DrawerItem
          label="Sair"
          labelStyle={{ color: colors.danger }}
          icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={colors.danger} />}
          onPress={() => {
            props.navigation.closeDrawer();
            void logout();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { paddingTop: 0 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(1),
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    marginBottom: spacing(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 17, fontWeight: "700", color: colors.text },
  userEmail: { marginTop: 2, fontSize: 13, color: colors.muted },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing(1),
  },
});
