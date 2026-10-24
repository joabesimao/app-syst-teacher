import { Pressable, ScrollView, Text, View } from "react-native";
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
  scrollable?: boolean;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  style,
  scrollable,
}: SegmentedControlProps<T>) {
  const items = segments.map((segment) => {
    const selected = segment.key === value;
    return (
      <Pressable
        key={segment.key}
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        onPress={() => onChange(segment.key)}
        style={[styles.item, scrollable && styles.scrollItem, selected && styles.selected]}
      >
        <Text
          style={[styles.text, selected && styles.selectedText]}
          numberOfLines={1}
          adjustsFontSizeToFit={!scrollable}
        >
          {segment.label}
        </Text>
      </Pressable>
    );
  });

  if (!scrollable) {
    return (
      <View style={[styles.row, style]} accessibilityRole="tablist">
        {items}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={[styles.row, style]}
      accessibilityRole="tablist"
    >
      {items}
    </ScrollView>
  );
}
