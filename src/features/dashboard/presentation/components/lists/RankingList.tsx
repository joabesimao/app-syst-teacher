import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { listStyles } from "./listStyles";

export interface RankingRow {
  key: string;
  primary: string;
  secondary: string;
  value: string;
  color: string;
  onPress?: () => void;
}

export const RankingList = memo(function RankingList({ rows }: { rows: RankingRow[] }) {
  return (
    <View>
      {rows.map((row, index) => (
        <Pressable
          key={row.key}
          accessibilityRole="button"
          onPress={row.onPress}
          style={({ pressed }) => [listStyles.row, pressed && listStyles.pressed]}
        >
          <Text style={listStyles.position}>{index + 1}</Text>
          <View style={listStyles.grow}>
            <Text style={listStyles.primary} numberOfLines={1}>
              {row.primary}
            </Text>
            <Text style={listStyles.secondary}>{row.secondary}</Text>
          </View>
          <Text style={[listStyles.value, { color: row.color }]}>{row.value}</Text>
        </Pressable>
      ))}
    </View>
  );
});
