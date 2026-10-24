import { StyleSheet } from "react-native";
import { spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  card: { gap: spacing(1) },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing(1) },
});
