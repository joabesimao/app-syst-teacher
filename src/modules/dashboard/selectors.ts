import { colors } from "../../theme";
import { sameDiscipline } from "../../utils/labels";
import type { ReportCard, ReportCardStudent, YearAverage } from "./types";
import { OVERALL, PASSING_AVERAGE } from "./types";

export const TERM_LABELS = ["1º", "2º", "3º", "4º"];

const EMPTY: YearAverage = { terms: [null, null, null, null], annual: null };

export const studentYear = (student: ReportCardStudent, discipline: string): YearAverage => {
  if (discipline === OVERALL) return student.overall;
  return student.disciplines.find((item) => sameDiscipline(item.disciplineName, discipline)) ?? EMPTY;
};

export const classYear = (card: ReportCard, discipline: string): YearAverage => {
  if (discipline === OVERALL) return card.classAverage.overall;
  return (
    card.classAverage.disciplines.find((item) => sameDiscipline(item.disciplineName, discipline)) ??
    EMPTY
  );
};

export const scoreColor = (value: number | null | undefined) => {
  if (value === null || value === undefined) return colors.muted;
  if (value >= PASSING_AVERAGE) return colors.success;
  if (value >= 5) return colors.warning;
  return colors.danger;
};

export const STATUS_COLORS = {
  approved: colors.success,
  recovery: colors.warning,
  failed: colors.danger,
  noGrades: "#A1A1AA",
};

export const SERIES_COLORS = [colors.primary, "#7A5AF8", colors.warning, colors.success, "#EE46BC", "#2E90FA"];

export const lineData = (terms: (number | null)[]) =>
  terms.map((value, index) => ({
    value: value ?? undefined,
    hideDataPoint: value === null,
    label: TERM_LABELS[index],
  }));
