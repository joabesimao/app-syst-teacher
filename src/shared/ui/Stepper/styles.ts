import { StyleSheet } from "react-native";
import { colors, spacing } from "../../theme";

export const styles = StyleSheet.create({
  field: { gap: spacing(0.5) },
  label: { fontSize: 13, fontWeight: "600", color: colors.text },
  row: { flexDirection: "row", alignItems: "center", gap: spacing(1) },
  button: { width: 48 },
  value: { minWidth: 32, textAlign: "center", fontSize: 22, fontWeight: "700", color: colors.text },
});
