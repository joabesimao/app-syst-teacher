import { useWindowDimensions } from "react-native";
import { spacing } from "@/shared/theme";

const MAX_CONTENT_WIDTH = 720;
const MIN_CHART_WIDTH = 220;
const Y_AXIS_WIDTH = 40;

export function useChartWidth(extraPadding = 0) {
  const { width } = useWindowDimensions();
  return Math.max(MIN_CHART_WIDTH, Math.min(width, MAX_CONTENT_WIDTH) - spacing(8) - Y_AXIS_WIDTH - extraPadding);
}

export const barWidthFor = (chartWidth: number, count: number) =>
  Math.min(36, Math.max(18, chartWidth / (Math.max(count, 1) * 2)));
