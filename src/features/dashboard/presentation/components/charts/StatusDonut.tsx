import { memo, useMemo } from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import type { StatusSummary } from "../../../domain/models";
import { STATUS_COLORS } from "../../colors";
import { STATUS_ITEMS } from "../../labels";
import { chartStyles } from "./chartStyles";

export const StatusDonut = memo(function StatusDonut({ summary }: { summary: StatusSummary }) {
  const { total, data } = useMemo(
    () => ({
      total: STATUS_ITEMS.reduce((sum, [key]) => sum + summary[key], 0),
      data: STATUS_ITEMS.filter(([key]) => summary[key] > 0).map(([key]) => ({
        value: summary[key],
        color: STATUS_COLORS[key],
      })),
    }),
    [summary]
  );

  return (
    <View style={chartStyles.donutRow}>
      <PieChart
        data={data}
        donut
        radius={70}
        innerRadius={46}
        centerLabelComponent={() => (
          <View style={chartStyles.center}>
            <Text style={chartStyles.centerValue}>{total}</Text>
            <Text style={chartStyles.legendText}>alunos</Text>
          </View>
        )}
      />
      <View style={chartStyles.donutLegend}>
        {STATUS_ITEMS.map(([key, label]) => (
          <View key={key} style={chartStyles.legendItem}>
            <View style={[chartStyles.dot, { backgroundColor: STATUS_COLORS[key] }]} />
            <Text style={chartStyles.legendText}>
              {label}: <Text style={chartStyles.bold}>{summary[key]}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});
