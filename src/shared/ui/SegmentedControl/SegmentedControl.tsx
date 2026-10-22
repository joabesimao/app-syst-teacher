import { Pressable, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { styles } from "./styles";

export interface Segment<T extends string> {
  key: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string>({ segments, value, onChange, style }: SegmentedControlProps<T>) {
  return (
    <View style={[styles.row, style]} accessibilityRole="tablist">
      {segments.map((segment) => {
        const selected = segment.key === value;
        return (
          <Pressable
            key={segment.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(segment.key)}
            style={[styles.item, selected && styles.selected]}
          >
            <Text style={[styles.text, selected && styles.selectedText]}>{segment.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
