import { colors } from "@/shared/theme";
import type { ScoreLevel } from "../domain/rules";
import { isBelowMinimumAttendance, scoreLevel } from "../domain/rules";

const LEVEL_COLORS: Record<ScoreLevel, string> = {
  none: colors.muted,
  passing: colors.success,
  recovery: colors.warning,
  failing: colors.danger,
};

export const scoreColor = (value: number | null | undefined) => LEVEL_COLORS[scoreLevel(value)];

export const attendanceColor = (percent: number | null | undefined, fallback: string = colors.text) =>
  isBelowMinimumAttendance(percent) ? colors.danger : fallback;

export const STATUS_COLORS = {
  approved: colors.success,
  recovery: colors.warning,
  failed: colors.danger,
  noGrades: colors.subtle,
};

export const SERIES_COLORS = [colors.primary, "#7A5AF8", colors.warning, colors.success, "#EE46BC", "#2E90FA"];
