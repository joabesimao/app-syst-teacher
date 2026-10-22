import { StyleSheet } from "react-native";
import { colors, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing(0.75),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  head: { fontSize: 11, fontWeight: "700", color: colors.muted },
  name: { flex: 1, fontSize: 14, color: colors.text },
  cell: { width: 38, textAlign: "right", fontSize: 13, color: colors.text },
  annual: { width: 44, fontWeight: "700" },
});
