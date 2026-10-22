import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  banner: { borderRadius: radius.sm, padding: spacing(1.5), gap: spacing(1) },
  text: { fontSize: 14, color: colors.text },
  action: { alignSelf: "flex-start", minHeight: 36 },
});
