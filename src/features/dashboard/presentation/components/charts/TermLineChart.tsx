import { memo, useMemo } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors } from "@/shared/theme";
import { PASSING_AVERAGE } from "../../../domain/constants";
import type { TermSeries } from "../../../domain/models";
import { SERIES_COLORS } from "../../colors";
import { TERM_LABELS } from "../../labels";
import { chartStyles } from "./chartStyles";
import { Legend } from "./Legend";
import { useChartWidth } from "./useChartWidth";

export interface TermLineSeries {
  label: string;
  terms: TermSeries;
  color?: string;
}

const REFERENCE_LINE = { color: colors.muted, dashWidth: 4, dashGap: 4, thickness: 1 };

const toLineData = (terms: TermSeries) =>
  terms.map((value, index) => ({ value: value ?? undefined, hideDataPoint: value === null, label: TERM_LABELS[index] }));

export const TermLineChart = memo(function TermLineChart({ series }: { series: TermLineSeries[] }) {
  const width = useChartWidth();
  const colored = useMemo(
    () =>
      series.map((item, index) => ({
        ...item,
        color: item.color ?? SERIES_COLORS[index % SERIES_COLORS.length] ?? colors.primary,
      })),
    [series]
  );
  const dataSet = useMemo(
    () => colored.map((item) => ({ data: toLineData(item.terms), color: item.color, dataPointsColor: item.color })),
    [colored]
  );

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
        referenceLine1Config={REFERENCE_LINE}
        dataSet={dataSet}
      />
      <Legend items={colored.map((item) => ({ label: item.label, color: item.color }))} />
    </View>
  );
});
