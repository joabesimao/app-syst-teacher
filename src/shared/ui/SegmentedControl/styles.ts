import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing(1) },
  item: {
    flex: 1,
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(0.5),
    borderRadius: radius.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  scroll: { flexGrow: 0 },
  scrollItem: { flex: 0, paddingHorizontal: spacing(2) },
  selected: { backgroundColor: colors.surface, borderColor: colors.border },
  text: { fontWeight: "600", color: colors.muted },
  selectedText: { color: colors.text },
});
