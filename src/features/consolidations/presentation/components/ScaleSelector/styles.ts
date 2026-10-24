import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  field: { gap: spacing(0.75) },
  label: { fontSize: 15, fontWeight: "600", color: colors.text },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
  option: {
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(1.75),
    paddingVertical: spacing(1),
  },
  text: { fontSize: 14, fontWeight: "700" },
  selectedText: { color: colors.white },
});
