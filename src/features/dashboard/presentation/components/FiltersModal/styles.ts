import { StyleSheet } from "react-native";
import { colors, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), gap: spacing(1) },
  title: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: spacing(1) },
  label: { fontSize: 13, fontWeight: "600", color: colors.muted, marginTop: spacing(1.5) },
  footer: { flexDirection: "row", gap: spacing(1.5), padding: spacing(2) },
  button: { flex: 1 },
});
