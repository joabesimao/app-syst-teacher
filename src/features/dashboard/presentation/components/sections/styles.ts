import { StyleSheet } from "react-native";
import { spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
  consolidation: { gap: spacing(1), paddingVertical: spacing(1) },
  distribution: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1.5) },
});
