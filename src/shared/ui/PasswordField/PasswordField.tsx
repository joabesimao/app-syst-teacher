import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable } from "react-native";
import { colors } from "../../theme";
import { Field } from "../Field";
import type { FieldProps } from "../Field";

export type PasswordFieldProps = Omit<FieldProps, "secureTextEntry" | "accessory">;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      accessory={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
          hitSlop={8}
          onPress={() => setVisible((current) => !current)}
        >
          <Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={22} color={colors.muted} />
        </Pressable>
      }
    />
  );
}
