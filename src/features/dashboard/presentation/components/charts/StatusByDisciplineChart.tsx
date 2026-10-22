import { memo, useMemo } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "@/shared/theme";
import type { DisciplineStatusSummary } from "../../../domain/models";
import { STATUS_COLORS } from "../../colors";
import { STATUS_ITEMS } from "../../labels";
import { chartStyles } from "./chartStyles";
import { Legend } from "./Legend";
import { barWidthFor, useChartWidth } from "./useChartWidth";

const LEGEND = STATUS_ITEMS.map(([key, label]) => ({ label, color: STATUS_COLORS[key] }));

export const StatusByDisciplineChart = memo(function StatusByDisciplineChart({
  items,
}: {
  items: DisciplineStatusSummary[];
}) {
  const width = useChartWidth();
  const barWidth = barWidthFor(width, items.length);
  const stackData = useMemo(
    () =>
      items.map((item) => ({
        label: item.disciplineName.slice(0, 10),
        stacks: STATUS_ITEMS.map(([key]) => ({ value: item[key], color: STATUS_COLORS[key] })),
      })),
    [items]
  );

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
        stackData={stackData}
      />
      <Legend items={LEGEND} />
    </View>
  );
});
