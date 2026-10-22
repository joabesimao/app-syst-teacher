import { memo } from "react";
import { Text, View } from "react-native";
import { tones } from "../../theme";
import type { Tone } from "../../theme";
import { styles } from "./styles";

export const Chip = memo(function Chip({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  const { color, background } = tones[tone];
  return (
    <View style={[styles.chip, { backgroundColor: background }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
});
