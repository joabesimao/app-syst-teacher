import { StyleSheet } from "react-native";
import { colors, spacing } from "../theme";

export const commonStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), gap: spacing(1.5) },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing(3) },
  title: { fontSize: 22, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: colors.text },
  text: { fontSize: 15, color: colors.text },
  muted: { fontSize: 13, color: colors.muted },
  row: { flexDirection: "row", alignItems: "center", gap: spacing(1) },
  spaceBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing(1) },
  grow: { flex: 1 },
  pressed: { opacity: 0.7 },
  separator: { height: spacing(1.5) },
});
