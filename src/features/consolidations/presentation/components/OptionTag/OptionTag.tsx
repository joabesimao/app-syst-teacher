import { memo } from "react";
import { Text, View } from "react-native";
import type { CellDisplay, ConsolidationScaleOption } from "../../../domain/models";
import { optionTag } from "../../../domain/rules";
import { styles } from "./styles";

interface OptionTagProps {
  option: ConsolidationScaleOption | undefined;
  display: CellDisplay;
}

export const OptionTag = memo(function OptionTag({ option, display }: OptionTagProps) {
  if (!option) return <Text style={styles.blank}>–</Text>;
  const tag = optionTag(option, display);
  if (tag !== option.label) {
    return (
      <Text style={styles.icon} accessibilityLabel={option.label}>
        {tag}
      </Text>
    );
  }
  return (
    <View style={[styles.tag, { backgroundColor: `${option.color}1F` }]}>
      <Text style={[styles.text, { color: option.color }]} numberOfLines={1}>
        {option.label}
      </Text>
    </View>
  );
});
