import { memo } from "react";
import { Text, View } from "react-native";
import { formatNumber } from "@/shared/format";
import type { TermSeries } from "../../../domain/models";
import { scoreColor } from "../../colors";
import { styles } from "./styles";

interface ScoreRowProps {
  terms: TermSeries;
  annual: number | null;
  bold?: boolean;
}

export const ScoreRow = memo(function ScoreRow({ terms, annual, bold }: ScoreRowProps) {
  return (
    <View style={styles.scores}>
      {terms.map((value, index) => (
        <Text key={index} style={[styles.score, { color: scoreColor(value) }, bold && styles.bold]}>
          {formatNumber(value)}
        </Text>
      ))}
      <Text style={[styles.score, styles.annual, { color: scoreColor(annual) }]}>{formatNumber(annual)}</Text>
    </View>
  );
});
