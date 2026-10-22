import { memo, useMemo } from "react";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "@/shared/theme";
import { HISTOGRAM_LABELS } from "../../labels";
import { chartStyles } from "./chartStyles";
import { useChartWidth } from "./useChartWidth";

export const HistogramChart = memo(function HistogramChart({ buckets }: { buckets: number[] }) {
  const width = useChartWidth();
  const barWidth = width / 9;
  const data = useMemo(
    () => buckets.map((value, index) => ({ value, label: HISTOGRAM_LABELS[index] })),
    [buckets]
  );

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
      data={data}
    />
  );
});
