import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  field: { gap: spacing(0.5) },
  label: { fontSize: 13, fontWeight: "600", color: colors.text },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.sm,
    paddingHorizontal: spacing(1.5),
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputWithAccessory: { paddingRight: spacing(6) },
  accessory: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: spacing(1.5),
    justifyContent: "center",
  },
});
