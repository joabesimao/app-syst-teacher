import { StyleSheet } from "react-native";
import { spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: { gap: spacing(0.75) },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1), marginTop: spacing(0.5) },
});
