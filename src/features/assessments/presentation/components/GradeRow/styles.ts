import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: spacing(1.5) },
  info: { flex: 1 },
  input: {
    width: 80,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.sm,
    fontSize: 16,
    textAlign: "center",
    color: colors.text,
    backgroundColor: colors.surface,
  },
  disabled: { opacity: 0.6 },
});
