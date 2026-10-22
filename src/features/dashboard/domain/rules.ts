import { byText, sameText } from "@/shared/format";
import { MIN_ATTENDANCE_PERCENT, OVERALL, PASSING_AVERAGE, RECOVERY_AVERAGE } from "./constants";
import type {
  DashboardClassOption,
  ReportCard,
  ReportCardStudent,
  TeacherDashboard,
  TermSeries,
  YearAverage,
} from "./models";

const EMPTY_YEAR: YearAverage = { terms: [null, null, null, null], annual: null };

export const studentYear = (student: ReportCardStudent, discipline: string): YearAverage => {
  if (discipline === OVERALL) return student.overall;
  return student.disciplines.find((item) => sameText(item.disciplineName, discipline)) ?? EMPTY_YEAR;
};

export const classYear = (card: ReportCard, discipline: string): YearAverage => {
  if (discipline === OVERALL) return card.classAverage.overall;
  return card.classAverage.disciplines.find((item) => sameText(item.disciplineName, discipline)) ?? EMPTY_YEAR;
};

export type ScoreLevel = "none" | "passing" | "recovery" | "failing";

export const scoreLevel = (value: number | null | undefined): ScoreLevel => {
  if (value === null || value === undefined) return "none";
  if (value >= PASSING_AVERAGE) return "passing";
  if (value >= RECOVERY_AVERAGE) return "recovery";
  return "failing";
};

export const isBelowMinimumAttendance = (percent: number | null | undefined) =>
  percent !== null && percent !== undefined && percent < MIN_ATTENDANCE_PERCENT;

export const hasTermData = (series: { terms: TermSeries }[]) =>
  series.some((item) => item.terms.some((value) => value !== null));

export const disciplinesFor = (classes: DashboardClassOption[], classId?: string) => {
  const selected = classes.find((item) => item.id === classId);
  return [...new Set((selected ? [selected] : classes).flatMap((item) => item.disciplines))].sort(
    byText((item) => item)
  );
};

export type RankingMode = "best" | "worst" | "risers" | "fallers";

export interface RankingEntry {
  key: string;
  studentId: string;
  classId: string;
  fullName: string;
  className: string;
  value: number;
  change?: { previous: number; current: number };
}

export const rankingEntries = (dashboard: TeacherDashboard, mode: RankingMode): RankingEntry[] => {
  if (mode === "best" || mode === "worst") {
    return dashboard.ranking[mode].map((item) => ({
      key: `${item.classId}:${item.studentId}`,
      studentId: item.studentId,
      classId: item.classId,
      fullName: item.fullName,
      className: item.className,
      value: item.average,
    }));
  }
  return dashboard.evolution[mode].map((item) => ({
    key: `${item.classId}:${item.studentId}`,
    studentId: item.studentId,
    classId: item.classId,
    fullName: item.fullName,
    className: item.className,
    value: item.delta,
    change: { previous: item.previous, current: item.current },
  }));
};

export const isEvolutionMode = (mode: RankingMode) => mode === "risers" || mode === "fallers";
