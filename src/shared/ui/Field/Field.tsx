import type { ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import { colors } from "../../theme";
import { styles } from "./styles";

export interface FieldProps extends TextInputProps {
  label: string;
  accessory?: ReactNode;
}

export function Field({ label, accessory, style, ...props }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.muted}
          style={[styles.input, accessory ? styles.inputWithAccessory : null, style]}
          {...props}
        />
        {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
      </View>
    </View>
  );
}
