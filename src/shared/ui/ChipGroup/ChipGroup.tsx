import { Pressable, ScrollView, Text } from "react-native";
import { styles } from "./styles";

export interface ChipOption<T extends string | number> {
  value: T;
  label: string;
}

interface ChipGroupProps<T extends string | number> {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ChipGroup<T extends string | number>({ options, value, onChange }: ChipGroupProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.chip, selected && styles.selected]}
          >
            <Text style={[styles.text, selected && styles.selectedText]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
