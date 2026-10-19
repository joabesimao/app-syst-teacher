import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  color?: string;
}

export function StatTile({ label, value, hint, color = colors.text }: StatTileProps) {
  return (
    <View style={tileStyles.tile} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={tileStyles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[tileStyles.value, { color }]}>{value}</Text>
      {hint ? (
        <Text style={tileStyles.hint} numberOfLines={2}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const tileStyles = StyleSheet.create({
  tile: {
    flexBasis: "47%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(1.5),
    gap: 2,
  },
  label: { fontSize: 12, color: colors.muted },
  value: { fontSize: 24, fontWeight: "700" },
  hint: { fontSize: 11, color: colors.muted },
});
