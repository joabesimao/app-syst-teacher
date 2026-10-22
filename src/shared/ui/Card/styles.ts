import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing(0.5),
  },
});
