import { StyleSheet } from "react-native";
import { colors, spacing } from "../../theme";

export const styles = StyleSheet.create({
  card: { gap: spacing(1.5) },
  header: { flexDirection: "row", alignItems: "flex-start", gap: spacing(1) },
  titles: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 12, color: colors.muted },
  placeholder: { minHeight: 120, alignItems: "center", justifyContent: "center" },
});
