import { memo } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../theme";
import { styles } from "./styles";

export type ButtonVariant = "primary" | "outline" | "ghost";

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button = memo(function Button({
  title,
  variant = "primary",
  loading,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.white : colors.primary} />
      ) : (
        <Text style={[styles.text, variant !== "primary" && styles.textSecondary]}>{title}</Text>
      )}
    </Pressable>
  );
});
