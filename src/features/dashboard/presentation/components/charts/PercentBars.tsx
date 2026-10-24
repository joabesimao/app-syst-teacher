import { memo, useMemo } from "react";
import { Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { formatNumber } from "@/shared/format";
import { colors } from "@/shared/theme";
import { attendanceColor } from "../../colors";
import { chartStyles } from "./chartStyles";
import { barWidthFor, useChartWidth } from "./useChartWidth";

interface PercentBarsProps {
  items: { label: string; value: number | null }[];
  colorFor?: (value: number | null) => string;
}

const defaultColor = (value: number | null) => attendanceColor(value, colors.primary);

export const PercentBars = memo(function PercentBars({ items, colorFor = defaultColor }: PercentBarsProps) {
  const width = useChartWidth();
  const barWidth = barWidthFor(width, items.length);
  const data = useMemo(
    () =>
      items.map((item) => ({
        value: item.value ?? 0,
        label: item.label.slice(0, 8),
        frontColor: colorFor(item.value),
        topLabelComponent: () => <Text style={chartStyles.axisText}>{formatNumber(item.value, "%")}</Text>,
      })),
    [items, colorFor]
  );

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
      data={data}
    />
  );
});
