import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.sm,
    paddingHorizontal: spacing(2),
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.primary },
  outline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.surface },
  ghost: { backgroundColor: "transparent", minHeight: 36, paddingHorizontal: spacing(1) },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  text: { color: colors.white, fontSize: 16, fontWeight: "600" },
  textSecondary: { color: colors.primary },
});
