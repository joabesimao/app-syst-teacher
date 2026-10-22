import { StyleSheet } from "react-native";
import { colors, spacing } from "@/shared/theme";

export const listStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(1.5),
    paddingVertical: spacing(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: { opacity: 0.6 },
  position: { width: 22, textAlign: "center", fontWeight: "700", color: colors.muted },
  grow: { flex: 1, gap: 2 },
  right: { alignItems: "flex-end", gap: 2 },
  primary: { fontSize: 15, fontWeight: "600", color: colors.text },
  secondary: { fontSize: 12, color: colors.muted },
  value: { fontSize: 16, fontWeight: "700" },
});
