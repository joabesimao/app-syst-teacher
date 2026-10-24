import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  editor: { gap: spacing(1.5) },
  option: {
    gap: spacing(1),
    padding: spacing(1.5),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  optionTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  optionActions: { flexDirection: "row" },
  fieldsRow: { flexDirection: "row", gap: spacing(1) },
  colors: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
  swatch: { width: 28, height: 28, borderRadius: radius.pill, borderWidth: 3, borderColor: colors.surface },
  swatchSelected: { borderColor: colors.text },
  preview: { flexDirection: "row", flexWrap: "wrap", gap: spacing(0.75) },
});
