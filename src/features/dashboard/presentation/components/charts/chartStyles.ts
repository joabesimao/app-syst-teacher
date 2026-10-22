import { StyleSheet } from "react-native";
import { colors, spacing } from "@/shared/theme";

export const chartStyles = StyleSheet.create({
  axisText: { fontSize: 10, color: colors.muted },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1.5), marginTop: spacing(1) },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendText: { fontSize: 12, color: colors.text },
  bold: { fontWeight: "700" },
  dot: { width: 10, height: 10, borderRadius: 5 },
  donutRow: { flexDirection: "row", alignItems: "center", gap: spacing(2) },
  donutLegend: { flex: 1, gap: spacing(1) },
  center: { alignItems: "center" },
  centerValue: { fontSize: 20, fontWeight: "700", color: colors.text },
});
