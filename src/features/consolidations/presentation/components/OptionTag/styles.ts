import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  tag: { borderRadius: radius.pill, paddingHorizontal: spacing(1), paddingVertical: 2 },
  text: { fontSize: 12, fontWeight: "700" },
  icon: { fontSize: 18 },
  blank: { color: colors.subtle },
});
