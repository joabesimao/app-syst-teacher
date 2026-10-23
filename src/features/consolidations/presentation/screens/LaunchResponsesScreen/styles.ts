import { StyleSheet } from "react-native";
import { spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: { padding: spacing(2) },
  card: { gap: spacing(2.5) },
  actions: { gap: spacing(1) },
  row: { flexDirection: "row", gap: spacing(1) },
});
