import { StyleSheet } from "react-native";
import { spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  header: { gap: spacing(1) },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
});
