import { StyleSheet } from "react-native";
import { spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  card: { gap: spacing(2) },
  group: { gap: spacing(0.5) },
  items: { minHeight: 120, textAlignVertical: "top" },
  scale: { flexDirection: "row", flexWrap: "wrap", gap: spacing(0.75) },
});
