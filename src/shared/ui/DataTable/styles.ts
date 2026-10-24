import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const ROW_HEIGHT = 44;

export const styles = StyleSheet.create({
  table: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  sticky: { borderRightWidth: 1, borderRightColor: colors.border },
  row: { flexDirection: "row" },
  cell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: spacing(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  stickyCell: { alignItems: "flex-start" },
  center: { alignItems: "center" },
  headerCell: { backgroundColor: colors.background },
  footerCell: { backgroundColor: colors.infoSoft, borderBottomWidth: 0 },
  headerText: { fontSize: 12, fontWeight: "700", color: colors.muted, textAlign: "center" },
  cellText: { fontSize: 14, color: colors.text },
  footerText: { fontSize: 14, fontWeight: "700", color: colors.text },
  pressed: { opacity: 0.6 },
});
