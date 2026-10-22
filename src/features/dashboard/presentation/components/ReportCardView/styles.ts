import { StyleSheet } from "react-native";
import { colors, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: { gap: spacing(1) },
  header: { flexDirection: "row", alignItems: "center", paddingTop: spacing(0.5) },
  headerText: { fontSize: 11, fontWeight: "700", color: colors.muted },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: { opacity: 0.6 },
  total: { borderBottomWidth: 0, borderTopWidth: 2, borderTopColor: colors.border },
  name: { flex: 1, fontSize: 14, color: colors.text, paddingRight: spacing(1) },
  transferred: { fontSize: 11, color: colors.warning },
  scores: { flexDirection: "row" },
  score: { width: 34, textAlign: "right", fontSize: 13, fontWeight: "500" },
  annual: { width: 42 },
  bold: { fontWeight: "700" },
});
