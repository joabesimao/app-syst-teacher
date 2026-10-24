import { StyleSheet } from "react-native";
import { colors, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  row: {
    gap: spacing(0.5),
    paddingVertical: spacing(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  value: { fontSize: 15, fontWeight: "700", color: colors.primary },
  items: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
  item: { flexDirection: "row", alignItems: "center", gap: spacing(0.5) },
  itemLabel: { fontSize: 12, color: colors.muted },
});
