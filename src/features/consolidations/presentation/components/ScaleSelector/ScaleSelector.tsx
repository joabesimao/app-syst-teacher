import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import type { ConsolidationScaleOption } from "../../../domain/models";
import { styles } from "./styles";

interface ScaleSelectorProps {
  label: string;
  options: ConsolidationScaleOption[];
  value: string | null;
  editable: boolean;
  onChange: (optionId: string | null) => void;
}

export const ScaleSelector = memo(function ScaleSelector({
  label,
  options,
  value,
  editable,
  onChange,
}: ScaleSelectorProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityLabel={`${label}: ${option.label}`}
              accessibilityState={{ selected, disabled: !editable }}
              disabled={!editable}
              onPress={() => onChange(selected ? null : option.id)}
              style={[
                styles.option,
                { borderColor: option.color },
                selected && { backgroundColor: option.color },
              ]}
            >
              <Text style={[styles.text, { color: selected ? styles.selectedText.color : option.color }]}>
                {option.icon ? `${option.icon} ` : ""}
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
