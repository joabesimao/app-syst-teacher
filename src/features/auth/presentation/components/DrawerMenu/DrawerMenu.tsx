import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "expo-router/drawer";
import type { DrawerContentComponentProps } from "expo-router/drawer";
import { colors, spacing } from "@/shared/theme";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useLogout } from "../../hooks/useLogout";
import { styles } from "./styles";

export function DrawerMenu(props: DrawerContentComponentProps) {
  const user = useCurrentUser();
  const logout = useLogout();
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
          labelStyle={styles.logoutLabel}
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
