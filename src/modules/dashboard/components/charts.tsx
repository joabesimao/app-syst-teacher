import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import { colors, spacing } from "../../../theme";
import { formatNumber } from "../../../utils/labels";
import { lineData, SERIES_COLORS, STATUS_COLORS, TERM_LABELS } from "../selectors";
import type { DisciplineStatusSummary, StatusSummary, TermSeries } from "../types";
import { HISTOGRAM_LABELS, PASSING_AVERAGE } from "../types";

const STATUS_ITEMS = [
  ["approved", "Aprovados"],
  ["recovery", "Recuperação"],
  ["failed", "Reprovados"],
  ["noGrades", "Sem notas"],
] as const;

export function useChartWidth(extraPadding = 0) {
  const { width } = useWindowDimensions();
  return Math.max(220, Math.min(width, 720) - spacing(8) - 40 - extraPadding);
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
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
}

export function StatusDonut({ summary }: { summary: StatusSummary }) {
  const total = STATUS_ITEMS.reduce((sum, [key]) => sum + summary[key], 0);
  const data = STATUS_ITEMS.filter(([key]) => summary[key] > 0).map(([key]) => ({
    value: summary[key],
    color: STATUS_COLORS[key],
  }));

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
}

export function StatusByDisciplineChart({ items }: { items: DisciplineStatusSummary[] }) {
  const width = useChartWidth();
  const barWidth = Math.min(36, Math.max(18, width / (items.length * 2)));

  return (
    <View>
      <BarChart
        width={width}
        height={180}
        barWidth={barWidth}
        spacing={barWidth}
        noOfSections={4}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={colors.border}
        yAxisTextStyle={chartStyles.axisText}
        xAxisLabelTextStyle={chartStyles.axisText}
        stackData={items.map((item) => ({
          label: item.disciplineName.slice(0, 10),
          stacks: STATUS_ITEMS.map(([key]) => ({ value: item[key], color: STATUS_COLORS[key] })),
        }))}
      />
      <Legend items={STATUS_ITEMS.map(([key, label]) => ({ label, color: STATUS_COLORS[key] }))} />
    </View>
  );
}

export function TermLineChart({ series }: { series: { label: string; terms: TermSeries; color?: string }[] }) {
  const width = useChartWidth();
  const colored = series.map((item, index) => ({
    ...item,
    color: item.color ?? SERIES_COLORS[index % SERIES_COLORS.length] ?? colors.primary,
  }));

  return (
    <View>
      <LineChart
        width={width}
        height={180}
        maxValue={10}
        noOfSections={5}
        initialSpacing={16}
        spacing={(width - 40) / 3}
        thickness={2.5}
        yAxisThickness={0}
        xAxisColor={colors.border}
        yAxisTextStyle={chartStyles.axisText}
        xAxisLabelTexts={TERM_LABELS}
        xAxisLabelTextStyle={chartStyles.axisText}
        showReferenceLine1
        referenceLine1Position={PASSING_AVERAGE}
        referenceLine1Config={{ color: colors.muted, dashWidth: 4, dashGap: 4, thickness: 1 }}
        dataSet={colored.map((item) => ({
          data: lineData(item.terms),
          color: item.color,
          dataPointsColor: item.color,
        }))}
      />
      <Legend items={colored.map((item) => ({ label: item.label, color: item.color }))} />
    </View>
  );
}

export function PercentBars({ items }: { items: { label: string; value: number | null }[] }) {
  const width = useChartWidth();
  const barWidth = Math.min(36, Math.max(18, width / (items.length * 2)));

  return (
    <BarChart
      width={width}
      height={180}
      maxValue={100}
      noOfSections={4}
      barWidth={barWidth}
      spacing={barWidth}
      yAxisThickness={0}
      xAxisColor={colors.border}
      yAxisTextStyle={chartStyles.axisText}
      xAxisLabelTextStyle={chartStyles.axisText}
      showValuesAsTopLabel
      topLabelTextStyle={chartStyles.axisText}
      data={items.map((item) => ({
        value: item.value ?? 0,
        label: item.label.slice(0, 8),
        frontColor: item.value !== null && item.value < 75 ? colors.danger : colors.primary,
        topLabelComponent: () => <Text style={chartStyles.axisText}>{formatNumber(item.value, "%")}</Text>,
      }))}
    />
  );
}

export function HistogramChart({ buckets }: { buckets: number[] }) {
  const width = useChartWidth();
  const barWidth = width / 9;

  return (
    <BarChart
      width={width}
      height={160}
      barWidth={barWidth}
      spacing={barWidth * 0.75}
      noOfSections={Math.max(1, Math.min(4, Math.max(...buckets)))}
      yAxisThickness={0}
      xAxisColor={colors.border}
      yAxisTextStyle={chartStyles.axisText}
      xAxisLabelTextStyle={chartStyles.axisText}
      frontColor={colors.primary}
      data={buckets.map((value, index) => ({ value, label: HISTOGRAM_LABELS[index] }))}
    />
  );
}

const chartStyles = StyleSheet.create({
  axisText: { fontSize: 10, color: colors.muted },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1.5), marginTop: spacing(1) },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendText: { fontSize: 12, color: colors.text },
  bold: { fontWeight: "700" },
  dot: { width: 10, height: 10, borderRadius: 5 },
  donutRow: { flexDirection: "row", alignItems: "center", gap: spacing(2) },
  donutLegend: { flex: 1, gap: spacing(1) },
  center: { alignItems: "center" },
  centerValue: { fontSize: 20, fontWeight: "700", color: colors.text },
});
