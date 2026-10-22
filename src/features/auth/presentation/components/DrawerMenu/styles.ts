import { StyleSheet } from "react-native";
import { colors, spacing } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { paddingTop: 0 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(1),
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    marginBottom: spacing(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 17, fontWeight: "700", color: colors.text },
  userEmail: { marginTop: 2, fontSize: 13, color: colors.muted },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing(1),
  },
  logoutLabel: { color: colors.danger },
});
