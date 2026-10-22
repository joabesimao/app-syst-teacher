import { StyleSheet } from "react-native";
import { radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing(1.25),
    paddingVertical: spacing(0.5),
    alignSelf: "flex-start",
  },
  text: { fontSize: 12, fontWeight: "600" },
});
