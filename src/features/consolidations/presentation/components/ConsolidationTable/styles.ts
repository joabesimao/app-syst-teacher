import { StyleSheet } from "react-native";
import { colors } from "@/shared/theme";

export const styles = StyleSheet.create({
  name: { fontSize: 13, color: colors.text },
  transferred: { color: colors.subtle, textDecorationLine: "line-through" },
  count: { fontSize: 14, fontWeight: "700" },
});
