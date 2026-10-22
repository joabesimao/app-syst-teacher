import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  tile: {
    flexBasis: "47%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(1.5),
    gap: 2,
  },
  label: { fontSize: 12, color: colors.muted },
  value: { fontSize: 24, fontWeight: "700" },
  hint: { fontSize: 11, color: colors.muted },
});
