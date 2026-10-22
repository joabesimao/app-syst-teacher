import { memo } from "react";
import { Text, View } from "react-native";
import { chartStyles } from "./chartStyles";

export const Legend = memo(function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <View style={chartStyles.legend}>
      {items.map((item) => (
        <View key={item.label} style={chartStyles.legendItem}>
          <View style={[chartStyles.dot, { backgroundColor: item.color }]} />
          <Text style={chartStyles.legendText}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
});
