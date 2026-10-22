import { memo } from "react";
import { Text, View } from "react-native";
import { colors } from "../../theme";
import { styles } from "./styles";

interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  color?: string;
}

export const StatTile = memo(function StatTile({ label, value, hint, color = colors.text }: StatTileProps) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {hint ? (
        <Text style={styles.hint} numberOfLines={2}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});
