import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing(1) },
  option: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: { fontWeight: "600", color: colors.muted },
});
