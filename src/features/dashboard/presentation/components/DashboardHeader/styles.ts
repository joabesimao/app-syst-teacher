import { StyleSheet } from "react-native";
import { spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  header: { gap: spacing(1), marginBottom: spacing(2) },
  text: { gap: 2 },
  filterButton: { minHeight: 40, alignSelf: "flex-start" },
});
