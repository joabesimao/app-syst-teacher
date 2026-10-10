import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { PressableProps, TextInputProps, ViewStyle } from "react-native";
import { colors, spacing } from "../theme";

type ButtonVariant = "primary" | "outline" | "ghost";

interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ title, variant = "primary", loading, disabled, style, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "outline" && styles.buttonOutline,
        variant === "ghost" && styles.buttonGhost,
        pressed && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : colors.primary} />
      ) : (
        <Text style={[styles.buttonText, variant !== "primary" && styles.buttonTextOutline]}>{title}</Text>
      )}
    </Pressable>
  );
}

interface FieldProps extends TextInputProps {
  label: string;
}

export function Field({ label, style, ...props }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} style={[styles.input, style]} {...props} />
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Banner({ tone = "danger", message }: { tone?: "danger" | "info" | "success"; message: string }) {
  const background = { danger: colors.dangerSoft, info: colors.infoSoft, success: colors.successSoft }[tone];
  return (
    <View style={[styles.banner, { backgroundColor: background }]}>
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

export function Chip({ label, color, background }: { label: string; color: string; background: string }) {
  return (
    <View style={[styles.chip, { backgroundColor: background }]}>
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), gap: spacing(1.5) },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing(3) },
  title: { fontSize: 22, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: colors.text, marginTop: spacing(1) },
  text: { fontSize: 15, color: colors.text },
  muted: { fontSize: 13, color: colors.muted },
  row: { flexDirection: "row", alignItems: "center", gap: spacing(1) },
  button: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: spacing(2),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonOutline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.surface },
  buttonGhost: { backgroundColor: "transparent", minHeight: 36, paddingHorizontal: spacing(1) },
  buttonPressed: { opacity: 0.8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  buttonTextOutline: { color: colors.primary },
  field: { gap: spacing(0.5) },
  label: { fontSize: 13, fontWeight: "600", color: colors.text },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#C8CCD7",
    borderRadius: 8,
    paddingHorizontal: spacing(1.5),
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing(0.5),
  },
  banner: { borderRadius: 8, padding: spacing(1.5) },
  bannerText: { fontSize: 14, color: colors.text },
  empty: { padding: spacing(3), alignItems: "center" },
  chip: { borderRadius: 999, paddingHorizontal: spacing(1.25), paddingVertical: spacing(0.5), alignSelf: "flex-start" },
  chipText: { fontSize: 12, fontWeight: "600" },
});
