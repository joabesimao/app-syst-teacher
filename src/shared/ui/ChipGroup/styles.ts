import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  field: { gap: spacing(0.5) },
  label: { fontSize: 13, fontWeight: "600", color: colors.text },
  row: { gap: spacing(1), paddingVertical: 2 },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.75),
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: 13, color: colors.text, fontWeight: "500" },
  selectedText: { color: colors.white },
});
